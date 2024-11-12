/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import {
	featuredImageField,
	slugField,
	parentField,
	passwordField,
	statusField,
	commentStatusField,
} from '@wordpress/fields';
import {
	createInterpolateElement,
	useMemo,
	useState,
} from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { commentAuthorAvatar as authorIcon } from '@wordpress/icons';
import { __experimentalHStack as HStack, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';

const getFormattedDate = ( dateToDisplay ) =>
	dateI18n(
		getSettings().formats.datetimeAbbreviated,
		getDate( dateToDisplay )
	);

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

	const { frontPageId, postsPageId } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const siteSettings = getEntityRecord( 'root', 'site' );
		return {
			frontPageId: siteSettings?.page_on_front,
			postsPageId: siteSettings?.page_for_posts,
		};
	}, [] );

	const fields = useMemo(
		() => [
			featuredImageField,
			{
				label: __( 'Title' ),
				id: 'title',
				type: 'text',
				getValue: ( { item } ) =>
					typeof item.title === 'string'
						? item.title
						: item.title?.raw,
				render: ( { item } ) => {
					const renderedTitle =
						typeof item.title === 'string'
							? item.title
							: item.title?.rendered;

					let suffix = '';
					if ( item.id === frontPageId ) {
						suffix = (
							<span className="edit-site-post-list__title-badge">
								{ __( 'Homepage' ) }
							</span>
						);
					} else if ( item.id === postsPageId ) {
						suffix = (
							<span className="edit-site-post-list__title-badge">
								{ __( 'Posts Page' ) }
							</span>
						);
					}

					return (
						<HStack
							className="edit-site-post-list__title"
							alignment="center"
							justify="flex-start"
						>
							<span>
								{ decodeEntities( renderedTitle ) ||
									__( '(no title)' ) }
							</span>
							{ suffix }
						</HStack>
					);
				},
				enableHiding: false,
			},
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
			{
				label: __( 'Date' ),
				id: 'date',
				type: 'datetime',
				render: ( { item } ) => {
					const isDraftOrPrivate = [ 'draft', 'private' ].includes(
						item.status
					);
					if ( isDraftOrPrivate ) {
						return createInterpolateElement(
							sprintf(
								/* translators: %s: page creation or modification date. */
								__( '<span>Modified: <time>%s</time></span>' ),
								getFormattedDate( item.date )
							),
							{
								span: <span />,
								time: <time />,
							}
						);
					}

					const isScheduled = item.status === 'future';
					if ( isScheduled ) {
						return createInterpolateElement(
							sprintf(
								/* translators: %s: page creation date */
								__( '<span>Scheduled: <time>%s</time></span>' ),
								getFormattedDate( item.date )
							),
							{
								span: <span />,
								time: <time />,
							}
						);
					}

					const isPublished = item.status === 'publish';
					if ( isPublished ) {
						return createInterpolateElement(
							sprintf(
								/* translators: %s: page creation time */
								__( '<span>Published: <time>%s</time></span>' ),
								getFormattedDate( item.date )
							),
							{
								span: <span />,
								time: <time />,
							}
						);
					}

					// Pending posts show the modified date if it's newer.
					const dateToDisplay =
						getDate( item.modified ) > getDate( item.date )
							? item.modified
							: item.date;

					const isPending = item.status === 'pending';
					if ( isPending ) {
						return createInterpolateElement(
							sprintf(
								/* translators: %s: page creation or modification date. */
								__( '<span>Modified: <time>%s</time></span>' ),
								getFormattedDate( dateToDisplay )
							),
							{
								span: <span />,
								time: <time />,
							}
						);
					}

					// Unknow status.
					return <time>{ getFormattedDate( item.date ) }</time>;
				},
			},
			slugField,
			parentField,
			commentStatusField,
			passwordField,
		],
		[ authors, frontPageId, postsPageId ]
	);

	return {
		isLoading: isLoadingAuthors,
		fields,
	};
}

export default usePostFields;
