/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	featuredImageField,
	slugField,
	parentField,
	passwordField,
	statusField,
	commentStatusField,
	titleField,
	dateField,
} from '@wordpress/fields';
import { useMemo, useState } from '@wordpress/element';
import { commentAuthorAvatar as authorIcon } from '@wordpress/icons';
import { __experimentalHStack as HStack, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';

function PostAuthorField( { item } ) {
	const { text, imageUrl } = useSelect(
		( select ) => {
			const { getUser } = select( coreStore );
			const user = getUser( item.author );
			return {
				imageUrl: user?.avatar_urls?.[ 48 ],
				text: user?.name,
			};
		},
		[ item ]
	);
	const [ isImageLoaded, setIsImageLoaded ] = useState( false );
	return (
		<HStack alignment="left" spacing={ 0 }>
			{ !! imageUrl && (
				<div
					className={ clsx( 'page-templates-author-field__avatar', {
						'is-loaded': isImageLoaded,
					} ) }
				>
					<img
						onLoad={ () => setIsImageLoaded( true ) }
						alt={ __( 'Author avatar' ) }
						src={ imageUrl }
					/>
				</div>
			) }
			{ ! imageUrl && (
				<div className="page-templates-author-field__icon">
					<Icon icon={ authorIcon } />
				</div>
			) }
			<span className="page-templates-author-field__name">{ text }</span>
		</HStack>
	);
}

function usePostFields() {
	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords( 'root', 'user', { per_page: -1 } );

	const fields = useMemo(
		() => [
			featuredImageField,
			titleField,
			{
				label: __( 'Author' ),
				id: 'author',
				type: 'integer',
				elements:
					authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ) || [],
				render: PostAuthorField,
				sort: ( a, b, direction ) => {
					const nameA = a._embedded?.author?.[ 0 ]?.name || '';
					const nameB = b._embedded?.author?.[ 0 ]?.name || '';

					return direction === 'asc'
						? nameA.localeCompare( nameB )
						: nameB.localeCompare( nameA );
				},
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
