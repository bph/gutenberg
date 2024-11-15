/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import type { Field } from '@wordpress/dataviews';
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
import type { BasePostWithEmbeddedAuthor } from '@wordpress/fields';

interface UsePostFieldsReturn {
	isLoading: boolean;
	fields: Field< BasePostWithEmbeddedAuthor >[];
}

interface Author {
	id: number;
	name: string;
}

function usePostFields(): UsePostFieldsReturn {
	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords< Author >( 'root', 'user', { per_page: -1 } );

	const fields = useMemo(
		() =>
			[
				featuredImageField,
				titleField,
				{
					...authorField,
					elements: authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ),
				},
				statusField,
				dateField,
				slugField,
				parentField,
				commentStatusField,
				passwordField,
			] as Field< BasePostWithEmbeddedAuthor >[],
		[ authors ]
	);

	return {
		isLoading: isLoadingAuthors,
		fields,
	};
}

/**
 * Hook to get the fields for a post (BasePost or BasePostWithEmbeddedAuthor).
 */
export default usePostFields;
