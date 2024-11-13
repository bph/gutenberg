/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import useTitle from '../routes/use-title';
import { POST_TYPE_LABELS, TEMPLATE_POST_TYPE } from '../../utils/constants';

function useEditorTitle( postType, postId ) {
	const { title, isLoaded } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, hasFinishedResolution } =
				select( coreStore );
			const { __experimentalGetTemplateInfo: getTemplateInfo } =
				select( editorStore );
			const _record = getEditedEntityRecord(
				'postType',
				postType,
				postId
			);
			const _isLoaded = hasFinishedResolution( 'getEditedEntityRecord', [
				'postType',
				postType,
				postId,
			] );
			const templateInfo = getTemplateInfo( _record );

			return {
				title: templateInfo.title,
				isLoaded: _isLoaded,
			};
		},
		[ postType, postId ]
	);

	let editorTitle;
	if ( isLoaded ) {
		editorTitle = sprintf(
			// translators: A breadcrumb trail for the Admin document title. 1: title of template being edited, 2: type of template (Template or Template Part).
			_x( '%1$s ‹ %2$s', 'breadcrumb trail' ),
			decodeEntities( title ),
			POST_TYPE_LABELS[ postType ] ??
				POST_TYPE_LABELS[ TEMPLATE_POST_TYPE ]
		);
	}

	// Only announce the title once the editor is ready to prevent "Replace"
	// action in <URLQueryController> from double-announcing.
	useTitle( isLoaded && editorTitle );
}

export default useEditorTitle;
