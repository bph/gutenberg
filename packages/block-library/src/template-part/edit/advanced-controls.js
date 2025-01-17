/**
 * WordPress dependencies
 */
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { SelectControl, TextControl } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { TemplatePartImportControls } from './import-controls';
import { htmlElementMessages } from '../../utils/messages';

export function TemplatePartAdvancedControls( {
	tagName,
	setAttributes,
	isEntityAvailable,
	templatePartId,
	defaultWrapper,
	hasInnerBlocks,
} ) {
	const [ area, setArea ] = useEntityProp(
		'postType',
		'wp_template_part',
		'area',
		templatePartId
	);

	const [ title, setTitle ] = useEntityProp(
		'postType',
		'wp_template_part',
		'title',
		templatePartId
	);

	const defaultTemplatePartAreas = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecord( 'root', '__unstableBase' )
				?.default_template_part_areas || [],
		[]
	);

	const areaOptions = defaultTemplatePartAreas.map(
		( { label, area: _area } ) => ( {
			label,
			value: _area,
		} )
	);

	return (
		<>
			{ isEntityAvailable && (
				<>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Title' ) }
						value={ title }
						onChange={ ( value ) => {
							setTitle( value );
						} }
						onFocus={ ( event ) => event.target.select() }
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Area' ) }
						labelPosition="top"
						options={ areaOptions }
						value={ area }
						onChange={ setArea }
					/>
				</>
			) }
			<SelectControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'HTML element' ) }
				options={ [
					{
						label: sprintf(
							/* translators: %s: HTML tag based on area. */
							__( 'Default based on area (%s)' ),
							`<${ defaultWrapper }>`
						),
						value: '',
					},
					{ label: '<header>', value: 'header' },
					{ label: '<main>', value: 'main' },
					{ label: '<section>', value: 'section' },
					{ label: '<article>', value: 'article' },
					{ label: '<aside>', value: 'aside' },
					{ label: '<footer>', value: 'footer' },
					{ label: '<div>', value: 'div' },
				] }
				value={ tagName || '' }
				onChange={ ( value ) => setAttributes( { tagName: value } ) }
				help={ htmlElementMessages[ tagName ] }
			/>
			{ ! hasInnerBlocks && (
				<TemplatePartImportControls
					area={ area }
					setAttributes={ setAttributes }
				/>
			) }
		</>
	);
}
