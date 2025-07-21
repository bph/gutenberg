/**
 * WordPress dependencies
 */
import { dateI18n, getDate, getSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import type {
	DataViewRenderFieldProps,
	SortDirection,
	ValidationContext,
	FieldTypeDefinition,
} from '../types';
import { renderFromElements } from '../utils';

const getFormattedDate = ( dateToDisplay: string | null ) =>
	dateI18n( getSettings().formats.date, getDate( dateToDisplay ) );

function sort( a: any, b: any, direction: SortDirection ) {
	const timeA = new Date( a ).getTime();
	const timeB = new Date( b ).getTime();

	return direction === 'asc' ? timeA - timeB : timeB - timeA;
}

function isValid( value: any, context?: ValidationContext ) {
	if ( context?.elements ) {
		const validValues = context?.elements.map( ( f ) => f.value );
		if ( ! validValues.includes( value ) ) {
			return false;
		}
	}

	return true;
}

export default {
	sort,
	isValid,
	Edit: null,
	render: ( { item, field }: DataViewRenderFieldProps< any > ) => {
		if ( field.elements ) {
			return renderFromElements( { item, field } );
		}

		const value = field.getValue( { item } );
		if ( ! value ) {
			return '';
		}

		return getFormattedDate( value );
	},
	enableSorting: true,
	filterBy: false,
} satisfies FieldTypeDefinition< any >;
