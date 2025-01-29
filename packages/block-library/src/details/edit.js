/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: __( 'Type / to add a hidden block' ),
		},
	],
];

function DetailsEdit( { attributes, setAttributes } ) {
	const { name, showContent, summary, allowedBlocks, placeholder } =
		attributes;
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		__experimentalCaptureToolbars: true,
		allowedBlocks,
	} );
	const [ isOpen, setIsOpen ] = useState( showContent );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							showContent: false,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						isShownByDefault
						label={ __( 'Open by default' ) }
						hasValue={ () => showContent }
						onDeselect={ () => {
							setAttributes( {
								showContent: false,
							} );
						} }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open by default' ) }
							checked={ showContent }
							onChange={ () =>
								setAttributes( {
									showContent: ! showContent,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="advanced">
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Name attribute' ) }
					value={ name || '' }
					onChange={ ( newName ) =>
						setAttributes( { name: newName } )
					}
					help={ __(
						'Enables multiple Details blocks with the same name attribute to be connected, with only one open at a time.'
					) }
				/>
			</InspectorControls>
			<details { ...innerBlocksProps } open={ isOpen }>
				<summary
					onClick={ ( event ) => {
						event.preventDefault();
						setIsOpen( ! isOpen );
					} }
				>
					<RichText
						identifier="summary"
						aria-label={ __( 'Write summary' ) }
						placeholder={ placeholder || __( 'Write summary…' ) }
						allowedFormats={ [] }
						withoutInteractiveFormatting
						value={ summary }
						onChange={ ( newSummary ) =>
							setAttributes( { summary: newSummary } )
						}
					/>
				</summary>
				{ innerBlocksProps.children }
			</details>
		</>
	);
}

export default DetailsEdit;
