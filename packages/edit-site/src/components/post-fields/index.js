/**
 * WordPress dependencies
 */
import {
	featuredImageField,
	slugField,
	parentField,
	passwordField,
	statusField,
	commentStatusField,
	titleField,
	dateField,
	authorField,
} from '@wordpress/fields';
import { useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';

function usePostFields() {
	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords( 'root', 'user', { per_page: -1 } );

	const fields = useMemo(
		() => [
			featuredImageField,
			titleField,
			{
				...authorField,
				elements:
					authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ) || [],
			},
			statusField,
			dateField,
			slugField,
			parentField,
			commentStatusField,
			passwordField,
		],
		[ authors ]
	);

	return {
		isLoading: isLoadingAuthors,
		fields,
	};
}

export default usePostFields;
