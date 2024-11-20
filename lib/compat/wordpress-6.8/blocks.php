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

	$experimental_to_stable_keys = array(
		'typography'           => array(
			'__experimentalFontFamily'     => 'fontFamily',
			'__experimentalFontStyle'      => 'fontStyle',
			'__experimentalFontWeight'     => 'fontWeight',
			'__experimentalLetterSpacing'  => 'letterSpacing',
			'__experimentalTextDecoration' => 'textDecoration',
			'__experimentalTextTransform'  => 'textTransform',
		),
		'__experimentalBorder' => 'border',
	);

	$updated_supports = array();
	foreach ( $args['supports'] as $support => $config ) {
		// Add the support's config as is when it's not in need of stabilization.
		if ( empty( $experimental_to_stable_keys[ $support ] ) ) {
			$updated_supports[ $support ] = $config;
			continue;
		}

		// Stabilize the support's key if needed e.g. __experimentalBorder => border.
		if ( is_string( $experimental_to_stable_keys[ $support ] ) ) {
			$stabilized_key = $experimental_to_stable_keys[ $support ];

			// If there is no stabilized key present, use the experimental config as is.
			if ( ! array_key_exists( $stabilized_key, $args['supports'] ) ) {
				$updated_supports[ $stabilized_key ] = $config;
				continue;
			}

			/*
			 * Determine the order of keys, so the last defined can be preferred.
			 *
			 * The reason for preferring the last defined key is that after filters
			 * are applied, the last inserted key is likely the most up-to-date value.
			 * We cannot determine with certainty which value was "last modified" so
			 * the insertion order is the best guess. The extreme edge case of multiple
			 * filters tweaking the same support property will become less over time as
			 * extenders migrate existing blocks and plugins to stable keys.
			 */
			$key_positions      = array_flip( array_keys( $args['supports'] ) );
			$experimental_index = $key_positions[ $support ] ?? -1;
			$stabilized_index   = $key_positions[ $stabilized_key ] ?? -1;
			$experimental_first = $experimental_index < $stabilized_index;

			// Update support config, prefer the last defined value.
			if ( is_array( $config ) ) {
				$updated_supports[ $stabilized_key ] = $experimental_first
					? array_merge( $config, $args['supports'][ $stabilized_key ] )
					: array_merge( $args['supports'][ $stabilized_key ], $config );
			} else {
				$updated_supports[ $stabilized_key ] = $experimental_first
					? $args['supports'][ $stabilized_key ]
					: $config;
			}

			continue;
		}

		// Stabilize individual support feature keys e.g. __experimentalFontFamily => fontFamily.
		if ( is_array( $experimental_to_stable_keys[ $support ] ) ) {
			$stable_support_config = array();
			foreach ( $config as $key => $value ) {
				if ( array_key_exists( $key, $experimental_to_stable_keys[ $support ] ) ) {
					$stable_support_config[ $experimental_to_stable_keys[ $support ][ $key ] ] = $value;
				} else {
					$stable_support_config[ $key ] = $value;
				}
			}
			$updated_supports[ $support ] = $stable_support_config;
		}
	}

	$args['supports'] = $updated_supports;

	return $args;
}

add_filter( 'register_block_type_args', 'gutenberg_stabilize_experimental_block_supports', PHP_INT_MAX, 1 );
