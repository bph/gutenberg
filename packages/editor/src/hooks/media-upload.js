/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { MediaUpload } from '@wordpress/media-utils';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

function MediaUploadWithCacheInvalidation( props ) {
	const { invalidateResolutionForStoreSelector } = useDispatch( coreStore );
	const { onClose: originalOnClose, ...rest } = props;

	const onClose = ( ...onCloseArgs ) => {
		invalidateResolutionForStoreSelector( 'getMediaItems' );
		originalOnClose?.( ...onCloseArgs );
	};
	return <MediaUpload onClose={ onClose } { ...rest } />;
}

addFilter(
	'editor.MediaUpload',
	'core/editor/components/media-upload',
	() => MediaUploadWithCacheInvalidation
);
