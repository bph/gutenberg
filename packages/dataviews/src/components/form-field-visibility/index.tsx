/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

type FormFieldVisibilityProps< Item > = React.PropsWithChildren< {
	field: NormalizedField< Item >;
	data: Item;
} >;

export default function FormFieldVisibility< Item >( {
	data,
	field,
	children,
}: FormFieldVisibilityProps< Item > ) {
	const isVisible = useMemo( () => {
		if ( field.isVisible ) {
			return field.isVisible( data );
		}
		return true;
	}, [ field.isVisible, data ] );

	if ( ! isVisible ) {
		return null;
	}
	return children;
}
