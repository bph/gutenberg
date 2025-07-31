/**
 * WordPress dependencies
 */
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataViewsContext from '../../components/dataviews-context';
import type { ViewGrid } from '../../types';

const imageSizes = [
	{
		value: 230,
		breakpoint: 1,
	},
	{
		value: 290,
		breakpoint: 1112, // at minimum image width, 4 images display at this container size
	},
	{
		value: 350,
		breakpoint: 1636, // at minimum image width, 6 images display at this container size
	},
	{
		value: 430,
		breakpoint: 588, // at minimum image width, 2 images display at this container size
	},
];

export default function PreviewSizePicker() {
	const context = useContext( DataViewsContext );
	const view = context.view as ViewGrid;

	if ( context.containerWidth < 588 ) {
		return null;
	}

	const breakValues = imageSizes.filter( ( size ) => {
		return context.containerWidth >= size.breakpoint;
	} );

	// If the container has resized and the set preview size is no longer available,
	// we reset it to the next smallest size.
	const previewSizeToUse = view.layout?.previewSize
		? breakValues
				.map( ( size, index ) => ( { ...size, index } ) )
				.filter(
					( size ) => size.value <= ( view.layout?.previewSize ?? 0 ) // We know the view.layout?.previewSize exists at this point but the linter doesn't seem to.
				)
				.sort( ( a, b ) => b.value - a.value )[ 0 ].index
		: 0;

	const marks = breakValues.map( ( size, index ) => {
		return {
			value: index,
		};
	} );

	return (
		<RangeControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			showTooltip={ false }
			label={ __( 'Preview size' ) }
			value={ previewSizeToUse }
			min={ 0 }
			max={ breakValues.length - 1 }
			withInputField={ false }
			onChange={ ( value = 0 ) => {
				context.onChangeView( {
					...view,
					layout: {
						...view.layout,
						previewSize: breakValues[ value ].value,
					},
				} );
			} }
			step={ 1 }
			marks={ marks }
		/>
	);
}
