/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ENTER } from '@wordpress/keycodes';
import { getDefaultBlockName, createBlock } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

const DEFAULT_TEXT = __( 'Read more' );

export default function MoreEdit( {
	attributes: { customText, noTeaser },
	insertBlocksAfter,
	setAttributes,
} ) {
	const onChangeInput = ( event ) => {
		setAttributes( {
			customText: event.target.value,
		} );
	};

	const onKeyDown = ( { keyCode } ) => {
		if ( keyCode === ENTER ) {
			insertBlocksAfter( [ createBlock( getDefaultBlockName() ) ] );
		}
	};

	const getHideExcerptHelp = ( checked ) =>
		checked
			? __( 'The excerpt is hidden.' )
			: __( 'The excerpt is visible.' );

	const toggleHideExcerpt = () => setAttributes( { noTeaser: ! noTeaser } );

	const style = {
		width: `${ ( customText ? customText : DEFAULT_TEXT ).length + 1.2 }em`,
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							noTeaser: false,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Hide excerpt' ) }
						isShownByDefault
						hasValue={ () => noTeaser }
						onDeselect={ () =>
							setAttributes( { noTeaser: false } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Hide the excerpt on the full content page'
							) }
							checked={ !! noTeaser }
							onChange={ toggleHideExcerpt }
							help={ getHideExcerptHelp }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<input
					aria-label={ __( '“Read more” link text' ) }
					type="text"
					value={ customText }
					placeholder={ DEFAULT_TEXT }
					onChange={ onChangeInput }
					onKeyDown={ onKeyDown }
					style={ style }
				/>
			</div>
		</>
	);
}
