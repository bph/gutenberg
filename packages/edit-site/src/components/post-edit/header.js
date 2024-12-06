/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Icon,
	__experimentalText as Text,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import {
	privateApis as editorPrivateApis,
	store as editorStore,
} from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { PostCardPanel } = unlock( editorPrivateApis );

export default function PostEditHeader( { postType, postId } ) {
	const ids = useMemo( () => postId.split( ',' ), [ postId ] );
	const { icon, labels } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getPostType } = select( coreStore );
			const { getPostIcon } = unlock( select( editorStore ) );
			const _record = getEditedEntityRecord(
				'postType',
				postType,
				ids[ 0 ]
			);

			return {
				icon: getPostIcon( postType, {
					area: _record?.area,
				} ),
				labels: getPostType( postType )?.labels,
			};
		},
		[ ids, postType ]
	);

	if ( ids.length === 1 ) {
		return (
			<PostCardPanel
				postType={ postType }
				postId={ parseInt( ids[ 0 ], 10 ) }
			/>
		);
	}

	return (
		<VStack spacing={ 1 } className="edit-site-post-edit-header">
			<HStack spacing={ 2 } align="center" justify="normal">
				<Icon
					className="edit-site-post-edit-header__icon"
					icon={ icon }
				/>
				<Text
					numberOfLines={ 2 }
					truncate
					className="edit-site-post-edit-header__title"
					as="h2"
				>
					{ labels?.name &&
						sprintf(
							// translators: %i number of selected items %s: Name of the plural post type e.g: "Posts".
							__( '%i %s' ),
							ids.length,
							labels?.name
						) }
				</Text>
			</HStack>
			<Text className="edit-site-post-edit-header__description">
				{ sprintf(
					// translators: %s: Name of the plural post type e.g: "Posts".
					__( 'Changes will be applied to all selected %s.' ),
					labels?.name.toLowerCase()
				) }
			</Text>
		</VStack>
	);
}
