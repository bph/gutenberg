/**
 * WordPress dependencies
 */
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import { useMemo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DataViewsContext from '../../components/dataviews-context';
import type { ViewGrid } from '../../types';

const viewportBreaks = {
	xhuge: { min: 3, max: 6, default: 5 },
	huge: { min: 2, max: 4, default: 4 },
	xlarge: { min: 2, max: 3, default: 3 },
	large: { min: 1, max: 2, default: 2 },
	mobile: { min: 1, max: 2, default: 2 },
};

function useViewPortBreakpoint() {
	const isXHuge = useViewportMatch( 'xhuge', '>=' );
	const isHuge = useViewportMatch( 'huge', '>=' );
	const isXlarge = useViewportMatch( 'xlarge', '>=' );
	const isLarge = useViewportMatch( 'large', '>=' );
	const isMobile = useViewportMatch( 'mobile', '>=' );

	if ( isXHuge ) {
		return 'xhuge';
	}
	if ( isHuge ) {
		return 'huge';
	}
	if ( isXlarge ) {
		return 'xlarge';
	}
	if ( isLarge ) {
		return 'large';
	}
	if ( isMobile ) {
		return 'mobile';
	}
	return null;
}

export function useUpdatedPreviewSizeOnViewportChange() {
	const viewport = useViewPortBreakpoint();
	const view = useContext( DataViewsContext ).view as ViewGrid;
	return useMemo( () => {
		const previewSize = view.layout?.previewSize;
		let newPreviewSize;
		if ( ! viewport || ! previewSize ) {
			return;
		}
		const breakValues = viewportBreaks[ viewport ];
		if ( previewSize < breakValues.min ) {
			newPreviewSize = breakValues.min;
		}
		if ( previewSize > breakValues.max ) {
			newPreviewSize = breakValues.max;
		}
		return newPreviewSize;
	}, [ viewport, view ] );
}

export default function PreviewSizePicker() {
	const viewport = useViewPortBreakpoint();
	const context = useContext( DataViewsContext );
	const view = context.view as ViewGrid;
	const breakValues = viewportBreaks[ viewport || 'mobile' ];
	const previewSizeToUse = view.layout?.previewSize || breakValues.default;

	const marks = useMemo(
		() =>
			Array.from(
				{ length: breakValues.max - breakValues.min + 1 },
				( _, i ) => {
					return {
						value: breakValues.min + i,
					};
				}
			),
		[ breakValues ]
	);

	if ( ! viewport ) {
		return null;
	}

	return (
		<RangeControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			showTooltip={ false }
			label={ __( 'Preview size' ) }
			value={ breakValues.max + breakValues.min - previewSizeToUse }
			marks={ marks }
			min={ breakValues.min }
			max={ breakValues.max }
			withInputField={ false }
			onChange={ ( value = 0 ) => {
				context.onChangeView( {
					...view,
					layout: {
						...view.layout,
						previewSize: breakValues.max + breakValues.min - value,
					},
				} );
			} }
			step={ 1 }
		/>
	);
}
