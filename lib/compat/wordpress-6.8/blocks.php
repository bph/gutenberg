<?php
/**
 * Temporary compatibility shims for block APIs present in Gutenberg.
 *
 * @package gutenberg
 */

/**
 * Filters the block type arguments during registration to stabilize
 * experimental block supports.
 *
 * This is a temporary compatibility shim as the approach in core is for this
 * to be handled within the WP_Block_Type class rather than requiring a filter.
 *
 * @param array $args Array of arguments for registering a block type.
 * @return array Array of arguments for registering a block type.
 */
function gutenberg_stabilize_experimental_block_supports( $args ) {
	if ( empty( $args['supports'] ) ) {
		return $args;
	}

	$experimental_supports_map       = array( '__experimentalBorder' => 'border' );
	$common_experimental_properties  = array(
		'__experimentalDefaultControls'   => 'defaultControls',
		'__experimentalSkipSerialization' => 'skipSerialization',
	);
	$experimental_support_properties = array(
		'typography' => array(
			'__experimentalFontFamily'     => 'fontFamily',
			'__experimentalFontStyle'      => 'fontStyle',
			'__experimentalFontWeight'     => 'fontWeight',
			'__experimentalLetterSpacing'  => 'letterSpacing',
			'__experimentalTextDecoration' => 'textDecoration',
			'__experimentalTextTransform'  => 'textTransform',
		),
	);
	$done                            = array();

	$updated_supports = array();
	foreach ( $args['supports'] as $support => $config ) {
		/*
		 * If this support config has already been stabilized, skip it.
		 * A stable support key occurring after an experimental key, gets
		 * stabilized then so that the two configs can be merged effectively.
		 */
		if ( isset( $done[ $support ] ) ) {
			continue;
		}

		$stable_support_key = $experimental_supports_map[ $support ] ?? $support;

		/*
		 * Use the support's config as is when it's not in need of stabilization.
		 *
		 * A support does not need stabilization if:
		 * - The support key doesn't need stabilization AND
		 * - Either:
		 *     - The config isn't an array, so can't have experimental properties OR
		 *     - The config is an array but has no experimental properties to stabilize.
		 */
		if ( $support === $stable_support_key &&
			( ! is_array( $config ) ||
				( ! isset( $experimental_support_properties[ $stable_support_key ] ) &&
				empty( array_intersect_key( $common_experimental_properties, $config ) )
				)
			)
		) {
			$updated_supports[ $support ] = $config;
			continue;
		}

		$stabilize_config = function ( $unstable_config, $stable_support_key ) use ( $experimental_support_properties, $common_experimental_properties ) {
			if ( ! is_array( $unstable_config ) ) {
				return $unstable_config;
			}

			$stable_config = array();
			foreach ( $unstable_config as $key => $value ) {
				// Get stable key from support-specific map, common properties map, or keep original.
				$stable_key = $experimental_support_properties[ $stable_support_key ][ $key ] ??
							$common_experimental_properties[ $key ] ??
							$key;

				$stable_config[ $stable_key ] = $value;

				/*
				 * The `__experimentalSkipSerialization` key needs to be kept until
				 * WP 6.8 becomes the minimum supported version. This is due to the
				 * core `wp_should_skip_block_supports_serialization` function only
				 * checking for `__experimentalSkipSerialization` in earlier versions.
				 */
				if ( '__experimentalSkipSerialization' === $key || 'skipSerialization' === $key ) {
					$stable_config['__experimentalSkipSerialization'] = $value;
				}
			}
			return $stable_config;
		};

		// Stabilize the config value.
		$stable_config = is_array( $config ) ? $stabilize_config( $config, $stable_support_key ) : $config;

		/*
		 * If a plugin overrides the support config with the `register_block_type_args`
		 * filter, both experimental and stable configs may be present. In that case,
		 * use the order keys are defined in to determine the final value.
		 *    - If config is an array, merge the arrays in their order of definition.
		 *    - If config is not an array, use the value defined last.
		 *
		 * The reason for preferring the last defined key is that after filters
		 * are applied, the last inserted key is likely the most up-to-date value.
		 * We cannot determine with certainty which value was "last modified" so
		 * the insertion order is the best guess. The extreme edge case of multiple
		 * filters tweaking the same support property will become less over time as
		 * extenders migrate existing blocks and plugins to stable keys.
		 */
		if ( $support !== $stable_support_key && isset( $args['supports'][ $stable_support_key ] ) ) {
			$key_positions      = array_flip( array_keys( $args['supports'] ) );
			$experimental_first =
				( $key_positions[ $support ] ?? PHP_INT_MAX ) <
				( $key_positions[ $stable_support_key ] ?? PHP_INT_MAX );

			/*
			 * To merge the alternative support config effectively, it also needs to be
			 * stabilized before merging to keep stabilized and experimental flags in
			 * sync.
			 */
			$args['supports'][ $stable_support_key ] = $stabilize_config( $args['supports'][ $stable_support_key ], $stable_support_key );
			// Prevents reprocessing this support as it was stabilized above.
			$done[ $stable_support_key ] = true;

			if ( is_array( $stable_config ) && is_array( $args['supports'][ $stable_support_key ] ) ) {
				$stable_config = $experimental_first
					? array_merge( $stable_config, $args['supports'][ $stable_support_key ] )
					: array_merge( $args['supports'][ $stable_support_key ], $stable_config );
			} else {
				$stable_config = $experimental_first
					? $args['supports'][ $stable_support_key ]
					: $stable_config;
			}
		}

		$updated_supports[ $stable_support_key ] = $stable_config;
	}

	$args['supports'] = $updated_supports;

	return $args;
}

add_filter( 'register_block_type_args', 'gutenberg_stabilize_experimental_block_supports', PHP_INT_MAX, 1 );

function gutenberg_apply_block_hooks_to_post_content( $content ) {
	// The `the_content` filter does not provide the post that the content is coming from.
	// However, we can infer it by calling `get_post()`, which will return the current post
	// if no post ID is provided.
	return apply_block_hooks_to_content( $content, get_post(), 'insert_hooked_blocks' );
}
// We need to apply this filter before `do_blocks` (which is hooked to `the_content` at priority 9).
add_filter( 'the_content', 'gutenberg_apply_block_hooks_to_post_content', 8 );

/**
 * Hooks into the REST API response for the Posts endpoint and adds the first and last inner blocks.
 *
 * @since 6.6.0
 * @since 6.8.0 Support non-`wp_navigation` post types.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Post          $post     Post object.
 * @return WP_REST_Response The response object.
 */
function gutenberg_insert_hooked_blocks_into_rest_response( $response, $post ) {
	if ( empty( $response->data['content']['raw'] ) ) {
		return $response;
	}

	$attributes            = array();
	$ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
	if ( ! empty( $ignored_hooked_blocks ) ) {
		$ignored_hooked_blocks  = json_decode( $ignored_hooked_blocks, true );
		$attributes['metadata'] = array(
			'ignoredHookedBlocks' => $ignored_hooked_blocks,
		);
	}

	if ( 'wp_navigation' === $post->post_type ) {
		$wrapper_block_type = 'core/navigation';
	} elseif ( 'wp_block' === $post->post_type ) {
		$wrapper_block_type = 'core/block';
	} else {
		$wrapper_block_type = 'core/post-content';
	}

	$content = get_comment_delimited_block_content(
		$wrapper_block_type,
		$attributes,
		$response->data['content']['raw']
	);

	$content = apply_block_hooks_to_content(
		$content,
		$post,
		'insert_hooked_blocks_and_set_ignored_hooked_blocks_metadata'
	);

	// Remove mock block wrapper.
	$content = remove_serialized_parent_block( $content );

	$response->data['content']['raw'] = $content;

	// If the rendered content was previously empty, we leave it like that.
	if ( empty( $response->data['content']['rendered'] ) ) {
		return $response;
	}

	// No need to inject hooked blocks twice.
	$priority = has_filter( 'the_content', 'apply_block_hooks_to_content' );
	if ( false !== $priority ) {
		remove_filter( 'the_content', 'apply_block_hooks_to_content', $priority );
	}

	/** This filter is documented in wp-includes/post-template.php */
	$response->data['content']['rendered'] = apply_filters( 'the_content', $content );

	// Add back the filter.
	if ( false !== $priority ) {
		add_filter( 'the_content', 'apply_block_hooks_to_content', $priority );
	}

	return $response;
}
add_filter( 'rest_prepare_page', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );
add_filter( 'rest_prepare_post', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );
add_filter( 'rest_prepare_wp_block', 'gutenberg_insert_hooked_blocks_into_rest_response', 10, 2 );

/**
 * Updates the wp_postmeta with the list of ignored hooked blocks
 * where the inner blocks are stored as post content.
 *
 * @since 6.6.0
 * @since 6.8.0 Support other post types. (Previously, it was limited to `wp_navigation` only.)
 * @access private
 *
 * @param stdClass $post Post object.
 * @return stdClass The updated post object.
 */
function gutenberg_update_ignored_hooked_blocks_postmeta( $post ) {
	/*
	 * In this scenario the user has likely tried to create a new post object via the REST API.
	 * In which case we won't have a post ID to work with and store meta against.
	 */
	if ( empty( $post->ID ) ) {
		return $post;
	}

	/*
	 * Skip meta generation when consumers intentionally update specific fields
	 * and omit the content update.
	 */
	if ( ! isset( $post->post_content ) ) {
		return $post;
	}

	/*
	 * Skip meta generation if post type is not set.
	 */
	if ( ! isset( $post->post_type ) ) {
		return $post;
	}

	$attributes = array();

	$ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
	if ( ! empty( $ignored_hooked_blocks ) ) {
		$ignored_hooked_blocks  = json_decode( $ignored_hooked_blocks, true );
		$attributes['metadata'] = array(
			'ignoredHookedBlocks' => $ignored_hooked_blocks,
		);
	}

	if ( 'wp_navigation' === $post->post_type ) {
		$wrapper_block_type = 'core/navigation';
	} elseif ( 'wp_block' === $post->post_type ) {
		$wrapper_block_type = 'core/block';
	} else {
		$wrapper_block_type = 'core/post-content';
	}

	$markup = get_comment_delimited_block_content(
		$wrapper_block_type,
		$attributes,
		$post->post_content
	);

	$existing_post = get_post( $post->ID );
	// Merge the existing post object with the updated post object to pass to the block hooks algorithm for context.
	$context          = (object) array_merge( (array) $existing_post, (array) $post );
	$context          = new WP_Post( $context ); // Convert to WP_Post object.
	$serialized_block = apply_block_hooks_to_content( $markup, $context, 'set_ignored_hooked_blocks_metadata' );
	$root_block       = parse_blocks( $serialized_block )[0];

	$ignored_hooked_blocks = isset( $root_block['attrs']['metadata']['ignoredHookedBlocks'] )
		? $root_block['attrs']['metadata']['ignoredHookedBlocks']
		: array();

	if ( ! empty( $ignored_hooked_blocks ) ) {
		$existing_ignored_hooked_blocks = get_post_meta( $post->ID, '_wp_ignored_hooked_blocks', true );
		if ( ! empty( $existing_ignored_hooked_blocks ) ) {
			$existing_ignored_hooked_blocks = json_decode( $existing_ignored_hooked_blocks, true );
			$ignored_hooked_blocks          = array_unique( array_merge( $ignored_hooked_blocks, $existing_ignored_hooked_blocks ) );
		}

		if ( ! isset( $post->meta_input ) ) {
			$post->meta_input = array();
		}
		$post->meta_input['_wp_ignored_hooked_blocks'] = json_encode( $ignored_hooked_blocks );
	}

	$post->post_content = remove_serialized_parent_block( $serialized_block );
	return $post;
}
add_filter( 'rest_pre_insert_page', 'gutenberg_update_ignored_hooked_blocks_postmeta' );
add_filter( 'rest_pre_insert_post', 'gutenberg_update_ignored_hooked_blocks_postmeta' );
add_filter( 'rest_pre_insert_wp_block', 'gutenberg_update_ignored_hooked_blocks_postmeta' );
