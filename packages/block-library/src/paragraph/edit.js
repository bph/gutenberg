/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, _x, isRTL } from '@wordpress/i18n';
import {
	ToolbarButton,
	ToggleControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	useSettings,
	useBlockEditingMode,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { getBlockSupport } from '@wordpress/blocks';
import { formatLtr } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import { useOnEnter } from './use-enter';
import { unlock } from '../lock-unlock';

function ParagraphRTLControl( { direction, setDirection } ) {
	return (
		isRTL() && (
			<ToolbarButton
				icon={ formatLtr }
				title={ _x( 'Left to right', 'editor button' ) }
				isActive={ direction === 'ltr' }
				onClick={ () => {
					setDirection( direction === 'ltr' ? undefined : 'ltr' );
				} }
			/>
		)
	);
}

function hasDropCapDisabled( align ) {
	return align === ( isRTL() ? 'left' : 'right' ) || align === 'center';
}

function DropCapControl( { clientId, attributes, setAttributes, name } ) {
	// Please do not add a useSelect call to the paragraph block unconditionally.
	// Every useSelect added to a (frequently used) block will degrade load
	// and type performance. By moving it within InspectorControls, the subscription is
	// now only added for the selected block(s).
	const [ isDropCapFeatureEnabled ] = useSettings( 'typography.dropCap' );

	if ( ! isDropCapFeatureEnabled ) {
		return null;
	}

	const { align, dropCap } = attributes;

	let helpText;
	if ( hasDropCapDisabled( align ) ) {
		helpText = __( 'Not available for aligned text.' );
	} else if ( dropCap ) {
		helpText = __( 'Showing large initial letter.' );
	} else {
		helpText = __( 'Show a large initial letter.' );
	}

	const isDropCapControlEnabledByDefault = getBlockSupport(
		name,
		'typography.defaultControls.dropCap',
		false
	);

	return (
		<InspectorControls group="typography">
			<ToolsPanelItem
				hasValue={ () => !! dropCap }
				label={ __( 'Drop cap' ) }
				isShownByDefault={ isDropCapControlEnabledByDefault }
				onDeselect={ () => setAttributes( { dropCap: undefined } ) }
				resetAllFilter={ () => ( { dropCap: undefined } ) }
				panelId={ clientId }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Drop cap' ) }
					checked={ !! dropCap }
					onChange={ () => setAttributes( { dropCap: ! dropCap } ) }
					help={ helpText }
					disabled={ hasDropCapDisabled( align ) }
				/>
			</ToolsPanelItem>
		</InspectorControls>
	);
}

function ParagraphBlock( {
	attributes,
	mergeBlocks,
	onReplace,
	onRemove,
	setAttributes,
	clientId,
	isSelected: isSingleSelected,
	name,
} ) {
	const isZoomOut = useSelect( ( select ) =>
		unlock( select( blockEditorStore ) ).isZoomOut()
	);

	const { align, content, direction, dropCap } = attributes;
	const blockProps = useBlockProps( {
		ref: useOnEnter( { clientId, content } ),
		className: clsx( {
			'has-drop-cap': hasDropCapDisabled( align ) ? false : dropCap,
			[ `has-text-align-${ align }` ]: align,
		} ),
		style: { direction },
	} );
	const blockEditingMode = useBlockEditingMode();
	let { placeholder } = attributes;
	if ( isZoomOut ) {
		placeholder = '';
	} else if ( ! placeholder ) {
		placeholder = __( 'Type / to choose a block' );
	}

	return (
		<>
			{ blockEditingMode === 'default' && (
				<BlockControls group="block">
					<AlignmentControl
						value={ align }
						onChange={ ( newAlign ) =>
							setAttributes( {
								align: newAlign,
								dropCap: hasDropCapDisabled( newAlign )
									? false
									: dropCap,
							} )
						}
					/>
					<ParagraphRTLControl
						direction={ direction }
						setDirection={ ( newDirection ) =>
							setAttributes( { direction: newDirection } )
						}
					/>
				</BlockControls>
			) }
			{ isSingleSelected && (
				<DropCapControl
					name={ name }
					clientId={ clientId }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) }
			<RichText
				identifier="content"
				tagName="p"
				{ ...blockProps }
				value={ content }
				onChange={ ( newContent ) =>
					setAttributes( { content: newContent } )
				}
				onMerge={ mergeBlocks }
				onReplace={ onReplace }
				onRemove={ onRemove }
				aria-label={
					RichText.isEmpty( content )
						? __(
								'Empty block; start writing or type forward slash to choose a block'
						  )
						: __( 'Block: Paragraph' )
				}
				data-empty={ RichText.isEmpty( content ) }
				placeholder={ placeholder }
				data-custom-placeholder={
					placeholder && ! isZoomOut ? true : undefined
				}
				__unstableEmbedURLOnPaste
				__unstableAllowPrefixTransformations
			/>
		</>
	);
}

export default ParagraphBlock;
