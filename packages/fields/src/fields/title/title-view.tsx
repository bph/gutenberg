/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import type { Settings } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import { getItemTitle } from '../../actions/utils';

const TitleView = ( { item }: { item: BasePost } ) => {
	const { frontPageId, postsPageId } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const siteSettings = getEntityRecord(
			'root',
			'site'
		) as Partial< Settings >;
		return {
			frontPageId: siteSettings?.page_on_front,
			postsPageId: siteSettings?.page_for_posts,
		};
	}, [] );

	const renderedTitle = getItemTitle( item );

	let suffix;
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
				{ decodeEntities( renderedTitle ) || __( '(no title)' ) }
			</span>
			{ suffix }
		</HStack>
	);
};

export default TitleView;
