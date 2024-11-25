/**
 * External dependencies
 */
import { isPlainObject } from 'is-plain-object';
import { isValidElementType } from 'react-is';

/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';
import { applyFilters } from '@wordpress/hooks';
import warning from '@wordpress/warning';

/**
 * Internal dependencies
 */
import { isValidIcon, normalizeIconObject, omit } from '../api/utils';
import {
	BLOCK_ICON_DEFAULT,
	DEPRECATED_ENTRY_KEYS,
	EXPERIMENTAL_SUPPORTS_MAP,
	COMMON_EXPERIMENTAL_PROPERTIES,
	EXPERIMENTAL_SUPPORT_PROPERTIES,
} from '../api/constants';

/** @typedef {import('../api/registration').WPBlockType} WPBlockType */

/**
 * Mapping of legacy category slugs to their latest normal values, used to
 * accommodate updates of the default set of block categories.
 *
 * @type {Record<string,string>}
 */
const LEGACY_CATEGORY_MAPPING = {
	common: 'text',
	formatting: 'text',
	layout: 'design',
};

/**
 * Merge block variations bootstrapped from the server and client.
 *
 * When a variation is registered in both places, its properties are merged.
 *
 * @param {Array} bootstrappedVariations - A block type variations from the server.
 * @param {Array} clientVariations       - A block type variations from the client.
 * @return {Array} The merged array of block variations.
 */
function mergeBlockVariations(
	bootstrappedVariations = [],
	clientVariations = []
) {
	const result = [ ...bootstrappedVariations ];

	clientVariations.forEach( ( clientVariation ) => {
		const index = result.findIndex(
			( bootstrappedVariation ) =>
				bootstrappedVariation.name === clientVariation.name
		);

		if ( index !== -1 ) {
			result[ index ] = { ...result[ index ], ...clientVariation };
		} else {
			result.push( clientVariation );
		}
	} );

	return result;
}

/**
 * Stabilizes a block support configuration by converting experimental properties
 * to their stable equivalents.
 *
 * @param {Object} unstableConfig   The support configuration to stabilize.
 * @param {string} stableSupportKey The stable support key for looking up properties.
 * @return {Object} The stabilized support configuration.
 */
function stabilizeSupportConfig( unstableConfig, stableSupportKey ) {
	const stableConfig = {};
	for ( const [ key, value ] of Object.entries( unstableConfig ) ) {
		// Get stable key from support-specific map, common properties map, or keep original.
		const stableKey =
			EXPERIMENTAL_SUPPORT_PROPERTIES[ stableSupportKey ]?.[ key ] ??
			COMMON_EXPERIMENTAL_PROPERTIES[ key ] ??
			key;

		stableConfig[ stableKey ] = value;

		/*
		 * The `__experimentalSkipSerialization` key needs to be kept until
		 * WP 6.8 becomes the minimum supported version. This is due to the
		 * core `wp_should_skip_block_supports_serialization` function only
		 * checking for `__experimentalSkipSerialization` in earlier versions.
		 */
		if (
			key === '__experimentalSkipSerialization' ||
			key === 'skipSerialization'
		) {
			stableConfig.__experimentalSkipSerialization = value;
		}
	}
	return stableConfig;
}

/**
 * Stabilizes experimental block supports by converting experimental keys and properties
 * to their stable equivalents.
 *
 * @param {Object|undefined} rawSupports The block supports configuration to stabilize.
 * @return {Object|undefined} The stabilized block supports configuration.
 */
function stabilizeSupports( rawSupports ) {
	if ( ! rawSupports ) {
		return rawSupports;
	}

	/*
	 * Create a new object to avoid mutating the original. This ensures that
	 * custom block plugins that rely on immutable supports are not affected.
	 * See: https://github.com/WordPress/gutenberg/pull/66849#issuecomment-2463614281
	 */
	const newSupports = {};
	const done = {};

	for ( const [ support, config ] of Object.entries( rawSupports ) ) {
		/*
		 * If this support config has already been stabilized, skip it.
		 * A stable support key occurring after an experimental key, gets
		 * stabilized then so that the two configs can be merged effectively.
		 */
		if ( done[ support ] ) {
			continue;
		}

		const stableSupportKey =
			EXPERIMENTAL_SUPPORTS_MAP[ support ] ?? support;

		/*
		 * Use the support's config as is when it's not in need of stabilization.
		 * A support does not need stabilization if:
		 * - The support key doesn't need stabilization AND
		 * - Either:
		 *     - The config isn't an object, so can't have experimental properties OR
		 *     - The config is an object but has no experimental properties to stabilize.
		 */
		if (
			support === stableSupportKey &&
			( ! isPlainObject( config ) ||
				( ! EXPERIMENTAL_SUPPORT_PROPERTIES[ stableSupportKey ] &&
					Object.keys( config ).every(
						( key ) => ! COMMON_EXPERIMENTAL_PROPERTIES[ key ]
					) ) )
		) {
			newSupports[ support ] = config;
			continue;
		}

		// Stabilize the config value.
		const stableConfig = isPlainObject( config )
			? stabilizeSupportConfig( config, stableSupportKey )
			: config;

		/*
		 * If a plugin overrides the support config with the `blocks.registerBlockType`
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
		if (
			support !== stableSupportKey &&
			Object.hasOwn( rawSupports, stableSupportKey )
		) {
			const keyPositions = Object.keys( rawSupports ).reduce(
				( acc, key, index ) => {
					acc[ key ] = index;
					return acc;
				},
				{}
			);
			const experimentalFirst =
				( keyPositions[ support ] ?? Number.MAX_VALUE ) <
				( keyPositions[ stableSupportKey ] ?? Number.MAX_VALUE );

			if ( isPlainObject( rawSupports[ stableSupportKey ] ) ) {
				/*
				 * To merge the alternative support config effectively, it also needs to be
				 * stabilized before merging to keep stabilized and experimental flags in sync.
				 */
				rawSupports[ stableSupportKey ] = stabilizeSupportConfig(
					rawSupports[ stableSupportKey ],
					stableSupportKey
				);
				newSupports[ stableSupportKey ] = experimentalFirst
					? { ...stableConfig, ...rawSupports[ stableSupportKey ] }
					: { ...rawSupports[ stableSupportKey ], ...stableConfig };
				// Prevents reprocessing this support as it was merged above.
				done[ stableSupportKey ] = true;
			} else {
				newSupports[ stableSupportKey ] = experimentalFirst
					? rawSupports[ stableSupportKey ]
					: stableConfig;
			}
		} else {
			newSupports[ stableSupportKey ] = stableConfig;
		}
	}

	return newSupports;
}

/**
 * Takes the unprocessed block type settings, merges them with block type metadata
 * and applies all the existing filters for the registered block type.
 * Next, it validates all the settings and performs additional processing to the block type definition.
 *
 * @param {string}      name          Block name.
 * @param {WPBlockType} blockSettings Unprocessed block type settings.
 *
 * @return {WPBlockType | undefined} The block, if it has been processed and can be registered; otherwise `undefined`.
 */
export const processBlockType =
	( name, blockSettings ) =>
	( { select } ) => {
		const bootstrappedBlockType = select.getBootstrappedBlockType( name );

		const blockType = {
			name,
			icon: BLOCK_ICON_DEFAULT,
			keywords: [],
			attributes: {},
			providesContext: {},
			usesContext: [],
			selectors: {},
			supports: {},
			styles: [],
			blockHooks: {},
			save: () => null,
			...bootstrappedBlockType,
			...blockSettings,
			// blockType.variations can be defined as a filePath.
			variations: mergeBlockVariations(
				Array.isArray( bootstrappedBlockType?.variations )
					? bootstrappedBlockType.variations
					: [],
				Array.isArray( blockSettings?.variations )
					? blockSettings.variations
					: []
			),
		};

		// Stabilize any experimental supports before applying filters.
		blockType.supports = stabilizeSupports( blockType.supports );

		const settings = applyFilters(
			'blocks.registerBlockType',
			blockType,
			name,
			null
		);

		// Re-stabilize any experimental supports after applying filters.
		// This ensures that any supports updated by filters are also stabilized.
		blockType.supports = stabilizeSupports( blockType.supports );

		if (
			settings.description &&
			typeof settings.description !== 'string'
		) {
			deprecated( 'Declaring non-string block descriptions', {
				since: '6.2',
			} );
		}

		if ( settings.deprecated ) {
			settings.deprecated = settings.deprecated.map( ( deprecation ) => {
				// Stabilize any experimental supports before applying filters.
				let filteredDeprecation = {
					...deprecation,
					supports: stabilizeSupports( deprecation.supports ),
				};

				filteredDeprecation = // Only keep valid deprecation keys.
					applyFilters(
						'blocks.registerBlockType',
						// Merge deprecation keys with pre-filter settings
						// so that filters that depend on specific keys being
						// present don't fail.
						{
							// Omit deprecation keys here so that deprecations
							// can opt out of specific keys like "supports".
							...omit( blockType, DEPRECATED_ENTRY_KEYS ),
							...filteredDeprecation,
						},
						blockType.name,
						filteredDeprecation
					);
				// Re-stabilize any experimental supports after applying filters.
				// This ensures that any supports updated by filters are also stabilized.
				filteredDeprecation.supports = stabilizeSupports(
					filteredDeprecation.supports
				);

				return Object.fromEntries(
					Object.entries( filteredDeprecation ).filter( ( [ key ] ) =>
						DEPRECATED_ENTRY_KEYS.includes( key )
					)
				);
			} );
		}

		if ( ! isPlainObject( settings ) ) {
			warning( 'Block settings must be a valid object.' );
			return;
		}

		if ( typeof settings.save !== 'function' ) {
			warning( 'The "save" property must be a valid function.' );
			return;
		}
		if ( 'edit' in settings && ! isValidElementType( settings.edit ) ) {
			warning( 'The "edit" property must be a valid component.' );
			return;
		}

		// Canonicalize legacy categories to equivalent fallback.
		if ( LEGACY_CATEGORY_MAPPING.hasOwnProperty( settings.category ) ) {
			settings.category = LEGACY_CATEGORY_MAPPING[ settings.category ];
		}

		if (
			'category' in settings &&
			! select
				.getCategories()
				.some( ( { slug } ) => slug === settings.category )
		) {
			warning(
				'The block "' +
					name +
					'" is registered with an invalid category "' +
					settings.category +
					'".'
			);
			delete settings.category;
		}

		if ( ! ( 'title' in settings ) || settings.title === '' ) {
			warning( 'The block "' + name + '" must have a title.' );
			return;
		}
		if ( typeof settings.title !== 'string' ) {
			warning( 'Block titles must be strings.' );
			return;
		}

		settings.icon = normalizeIconObject( settings.icon );
		if ( ! isValidIcon( settings.icon.src ) ) {
			warning(
				'The icon passed is invalid. ' +
					'The icon should be a string, an element, a function, or an object following the specifications documented in https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#icon-optional'
			);
			return;
		}

		if (
			typeof settings?.parent === 'string' ||
			settings?.parent instanceof String
		) {
			settings.parent = [ settings.parent ];
			warning(
				'Parent must be undefined or an array of strings (block types), but it is a string.'
			);
			// Intentionally continue:
			//
			// While string values were never supported, they appeared to work with some unintended side-effects
			// that have been fixed by [#66250](https://github.com/WordPress/gutenberg/pull/66250).
			//
			// To be backwards-compatible, this code that automatically migrates strings to arrays.
		}

		if (
			! Array.isArray( settings?.parent ) &&
			settings?.parent !== undefined
		) {
			warning(
				'Parent must be undefined or an array of block types, but it is ',
				settings.parent
			);
			return;
		}

		if ( 1 === settings?.parent?.length && name === settings.parent[ 0 ] ) {
			warning(
				'Block "' +
					name +
					'" cannot be a parent of itself. Please remove the block name from the parent list.'
			);
			return;
		}

		return settings;
	};
