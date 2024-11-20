/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { processBlockType } from '../process-block-type';

describe( 'processBlockType', () => {
	const baseBlockSettings = {
		apiVersion: 3,
		attributes: {},
		edit: () => null,
		name: 'test/block',
		save: () => null,
		title: 'Test Block',
	};

	const select = {
		getBootstrappedBlockType: () => null,
	};

	afterEach( () => {
		removeFilter( 'blocks.registerBlockType', 'test/filterSupports' );
	} );

	it( 'should return the block type with stabilized supports', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					lineHeight: true,
					__experimentalFontFamily: true,
					__experimentalFontStyle: true,
					__experimentalFontWeight: true,
					__experimentalLetterSpacing: true,
					__experimentalTextTransform: true,
					__experimentalTextDecoration: true,
					__experimentalWritingMode: true,
					__experimentalDefaultControls: {
						fontSize: true,
						fontAppearance: true,
						textTransform: true,
					},
				},
				__experimentalBorder: {
					color: true,
					radius: true,
					style: true,
					width: true,
					__experimentalDefaultControls: {
						color: true,
						radius: true,
						style: true,
						width: true,
					},
				},
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toEqual( {
			typography: {
				fontSize: true,
				lineHeight: true,
				fontFamily: true,
				fontStyle: true,
				fontWeight: true,
				letterSpacing: true,
				textTransform: true,
				textDecoration: true,
				__experimentalWritingMode: true,
				__experimentalDefaultControls: {
					fontSize: true,
					fontAppearance: true,
					textTransform: true,
				},
			},
			border: {
				color: true,
				radius: true,
				style: true,
				width: true,
				__experimentalDefaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );

	it( 'should return the block type with stable supports', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					lineHeight: true,
					fontFamily: true,
					fontStyle: true,
					fontWeight: true,
					letterSpacing: true,
					textTransform: true,
					textDecoration: true,
					__experimentalWritingMode: true,
					__experimentalDefaultControls: {
						fontSize: true,
						fontAppearance: true,
						textTransform: true,
					},
				},
				__experimentalBorder: {
					color: true,
					radius: true,
					style: true,
					width: true,
					__experimentalDefaultControls: {
						color: true,
						radius: true,
						style: true,
						width: true,
					},
				},
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toEqual( {
			typography: {
				fontSize: true,
				lineHeight: true,
				fontFamily: true,
				fontStyle: true,
				fontWeight: true,
				letterSpacing: true,
				textTransform: true,
				textDecoration: true,
				__experimentalWritingMode: true,
				__experimentalDefaultControls: {
					fontSize: true,
					fontAppearance: true,
					textTransform: true,
				},
			},
			border: {
				color: true,
				radius: true,
				style: true,
				width: true,
				__experimentalDefaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );

	it( 'should reapply transformations after supports are filtered', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					lineHeight: true,
					__experimentalFontFamily: true,
					__experimentalFontStyle: true,
					__experimentalFontWeight: true,
					__experimentalLetterSpacing: true,
					__experimentalTextTransform: true,
					__experimentalTextDecoration: true,
					__experimentalWritingMode: true,
					__experimentalDefaultControls: {
						fontSize: true,
						fontAppearance: true,
						textTransform: true,
					},
				},
				__experimentalBorder: {
					color: true,
					radius: true,
					style: true,
					width: true,
					__experimentalDefaultControls: {
						color: true,
						radius: true,
						style: true,
						width: true,
					},
				},
			},
		};

		addFilter(
			'blocks.registerBlockType',
			'test/filterSupports',
			( settings, name ) => {
				if ( name === 'test/block' && settings.supports.typography ) {
					settings.supports.typography.__experimentalFontFamily = false;
					settings.supports.typography.__experimentalFontStyle = false;
					settings.supports.typography.__experimentalFontWeight = false;
					if ( ! settings.supports.__experimentalBorder ) {
						settings.supports.__experimentalBorder = {};
					}
					settings.supports.__experimentalBorder.radius = false;
				}
				return settings;
			}
		);

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toEqual( {
			typography: {
				fontSize: true,
				lineHeight: true,
				fontFamily: false,
				fontStyle: false,
				fontWeight: false,
				letterSpacing: true,
				textTransform: true,
				textDecoration: true,
				__experimentalWritingMode: true,
				__experimentalDefaultControls: {
					fontSize: true,
					fontAppearance: true,
					textTransform: true,
				},
			},
			border: {
				color: true,
				radius: false,
				style: true,
				width: true,
				__experimentalDefaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );

	it( 'should stabilize experimental supports within block deprecations', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					lineHeight: true,
					fontFamily: true,
					fontStyle: true,
					fontWeight: true,
					letterSpacing: true,
					textTransform: true,
					textDecoration: true,
					__experimentalWritingMode: true,
					__experimentalDefaultControls: {
						fontSize: true,
						fontAppearance: true,
						textTransform: true,
					},
				},
				border: {
					color: true,
					radius: true,
					style: true,
					width: true,
					__experimentalDefaultControls: {
						color: true,
						radius: true,
						style: true,
						width: true,
					},
				},
			},
			deprecated: [
				{
					supports: {
						typography: {
							__experimentalFontFamily: true,
							__experimentalFontStyle: true,
							__experimentalFontWeight: true,
							__experimentalLetterSpacing: true,
							__experimentalTextTransform: true,
							__experimentalTextDecoration: true,
							__experimentalWritingMode: true,
						},
						__experimentalBorder: {
							color: true,
							radius: true,
							style: true,
							width: true,
							__experimentalDefaultControls: {
								color: true,
								radius: true,
								style: true,
								width: true,
							},
						},
					},
				},
			],
		};

		// Freeze the deprecated block object and its supports so that the original is not mutated.
		// This ensures the test covers a regression where the original object was mutated.
		// See: https://github.com/WordPress/gutenberg/pull/63401#discussion_r1832394335.
		Object.freeze( blockSettings.deprecated[ 0 ] );
		Object.freeze( blockSettings.deprecated[ 0 ].supports );

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.deprecated[ 0 ].supports ).toEqual( {
			typography: {
				fontFamily: true,
				fontStyle: true,
				fontWeight: true,
				letterSpacing: true,
				textTransform: true,
				textDecoration: true,
				__experimentalWritingMode: true,
			},
			border: {
				color: true,
				radius: true,
				style: true,
				width: true,
				__experimentalDefaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );

	it( 'should reapply transformations after supports are filtered within block deprecations', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					lineHeight: true,
					fontFamily: true,
					fontStyle: true,
					fontWeight: true,
					letterSpacing: true,
					textTransform: true,
					textDecoration: true,
					__experimentalWritingMode: true,
					__experimentalDefaultControls: {
						fontSize: true,
						fontAppearance: true,
						textTransform: true,
					},
				},
				border: {
					color: true,
					radius: true,
					style: true,
					width: true,
					__experimentalDefaultControls: {
						color: true,
						radius: true,
						style: true,
						width: true,
					},
				},
			},
			deprecated: [
				{
					supports: {
						typography: {
							__experimentalFontFamily: true,
							__experimentalFontStyle: true,
							__experimentalFontWeight: true,
							__experimentalLetterSpacing: true,
							__experimentalTextTransform: true,
							__experimentalTextDecoration: true,
							__experimentalWritingMode: true,
						},
						__experimentalBorder: {
							color: true,
							radius: true,
							style: true,
							width: true,
							__experimentalDefaultControls: {
								color: true,
								radius: true,
								style: true,
								width: true,
							},
						},
					},
				},
			],
		};

		addFilter(
			'blocks.registerBlockType',
			'test/filterSupports',
			( settings, name ) => {
				if ( name === 'test/block' && settings.supports.typography ) {
					settings.supports.typography.__experimentalFontFamily = false;
					settings.supports.typography.__experimentalFontStyle = false;
					settings.supports.typography.__experimentalFontWeight = false;
					settings.supports.__experimentalBorder = { radius: false };
				}
				return settings;
			}
		);

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.deprecated[ 0 ].supports ).toEqual( {
			typography: {
				fontFamily: false,
				fontStyle: false,
				fontWeight: false,
				letterSpacing: true,
				textTransform: true,
				textDecoration: true,
				__experimentalWritingMode: true,
			},
			border: {
				color: true,
				radius: false,
				style: true,
				width: true,
				__experimentalDefaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );
} );
