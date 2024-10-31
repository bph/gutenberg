/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import type { DataViewRenderFieldProps } from '@wordpress/dataviews';
import { getTitleWithFallbackName } from './utils';
import { __ } from '@wordpress/i18n';

export const ParentView = ( {
	item,
}: DataViewRenderFieldProps< BasePost > ) => {
	const parent = useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );
			return item?.parent
				? getEntityRecord( 'postType', item.type, item.parent )
				: null;
		},
		[ item.parent, item.type ]
	);

	if ( parent ) {
		return <>{ getTitleWithFallbackName( parent ) }</>;
	}

	return <>{ __( 'None' ) }</>;
};
