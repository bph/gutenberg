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

	it( 'should stabilize experimental block supports', () => {
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

		expect( processedBlockType.supports ).toMatchObject( {
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
				defaultControls: {
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
				defaultControls: {
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

		expect( processedBlockType.supports ).toMatchObject( {
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
				defaultControls: {
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
				defaultControls: {
					color: true,
					radius: true,
					style: true,
					width: true,
				},
			},
		} );
	} );

	describe( 'block deprecations', () => {
		const deprecatedBlockSettings = {
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

		beforeEach( () => {
			// Freeze the deprecated block object and its supports so that the original is not mutated.
			Object.freeze( deprecatedBlockSettings.deprecated[ 0 ] );
			Object.freeze( deprecatedBlockSettings.deprecated[ 0 ].supports );
		} );

		it( 'should stabilize experimental supports', () => {
			const processedBlockType = processBlockType(
				'test/block',
				deprecatedBlockSettings
			)( { select } );

			expect( processedBlockType.deprecated[ 0 ].supports ).toMatchObject(
				{
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
						defaultControls: {
							color: true,
							radius: true,
							style: true,
							width: true,
						},
					},
				}
			);
		} );

		it( 'should reapply transformations after supports are filtered', () => {
			addFilter(
				'blocks.registerBlockType',
				'test/filterSupports',
				( settings, name ) => {
					if (
						name === 'test/block' &&
						settings.supports.typography
					) {
						settings.supports.typography.__experimentalFontFamily = false;
						settings.supports.typography.__experimentalFontStyle = false;
						settings.supports.typography.__experimentalFontWeight = false;
						settings.supports.__experimentalBorder = {
							radius: false,
						};
					}
					return settings;
				}
			);

			const processedBlockType = processBlockType(
				'test/block',
				deprecatedBlockSettings
			)( { select } );

			expect( processedBlockType.deprecated[ 0 ].supports ).toMatchObject(
				{
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
						defaultControls: {
							color: true,
							radius: true,
							style: true,
							width: true,
						},
					},
				}
			);
		} );
	} );

	it( 'should stabilize common experimental properties across all supports', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				typography: {
					fontSize: true,
					__experimentalDefaultControls: {
						fontSize: true,
					},
					__experimentalSkipSerialization: true,
				},
				spacing: {
					padding: true,
					__experimentalDefaultControls: {
						padding: true,
					},
					__experimentalSkipSerialization: true,
				},
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toMatchObject( {
			typography: {
				fontSize: true,
				defaultControls: {
					fontSize: true,
				},
				skipSerialization: true,
				__experimentalSkipSerialization: true,
			},
			spacing: {
				padding: true,
				defaultControls: {
					padding: true,
				},
				skipSerialization: true,
				__experimentalSkipSerialization: true,
			},
		} );
	} );

	it( 'should merge experimental and stable keys in order of definition', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				__experimentalBorder: {
					color: true,
					radius: false,
				},
				border: {
					color: false,
					style: true,
				},
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toMatchObject( {
			border: {
				color: false,
				radius: false,
				style: true,
			},
		} );

		const reversedSettings = {
			...baseBlockSettings,
			supports: {
				border: {
					color: false,
					style: true,
				},
				__experimentalBorder: {
					color: true,
					radius: false,
				},
			},
		};

		const reversedProcessedType = processBlockType(
			'test/block',
			reversedSettings
		)( { select } );

		expect( reversedProcessedType.supports ).toMatchObject( {
			border: {
				color: true,
				radius: false,
				style: true,
			},
		} );
	} );

	it( 'should handle non-object config values', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				__experimentalBorder: true,
				border: false,
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toMatchObject( {
			border: false,
		} );
	} );

	it( 'should not modify supports that do not need stabilization', () => {
		const blockSettings = {
			...baseBlockSettings,
			supports: {
				align: true,
				spacing: {
					padding: true,
					margin: true,
				},
			},
		};

		const processedBlockType = processBlockType(
			'test/block',
			blockSettings
		)( { select } );

		expect( processedBlockType.supports ).toMatchObject( {
			align: true,
			spacing: {
				padding: true,
				margin: true,
			},
		} );
	} );
} );
