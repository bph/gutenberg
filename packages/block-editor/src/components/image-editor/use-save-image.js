/**
 * WordPress dependencies
 */
// Disable Reason: Needs to be refactored.
// eslint-disable-next-line no-restricted-imports
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { useCallback, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';

const messages = {
	crop: __( 'Image cropped.' ),
	rotate: __( 'Image rotated.' ),
	cropAndRotate: __( 'Image cropped and rotated.' ),
};

export default function useSaveImage( {
	crop,
	rotation,
	url,
	id,
	onSaveImage,
	onFinishEditing,
} ) {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch( noticesStore );
	const [ isInProgress, setIsInProgress ] = useState( false );

	const cancel = useCallback( () => {
		setIsInProgress( false );
		onFinishEditing();
	}, [ onFinishEditing ] );

	const apply = useCallback( () => {
		setIsInProgress( true );

		const modifiers = [];

		if ( rotation > 0 ) {
			modifiers.push( {
				type: 'rotate',
				args: {
					angle: rotation,
				},
			} );
		}

		// The crop script may return some very small, sub-pixel values when the image was not cropped.
		// Crop only when the new size has changed by more than 0.1%.
		if ( crop.width < 99.9 || crop.height < 99.9 ) {
			modifiers.push( {
				type: 'crop',
				args: {
					left: crop.x,
					top: crop.y,
					width: crop.width,
					height: crop.height,
				},
			} );
		}

		if ( modifiers.length === 0 ) {
			// No changes to apply.
			setIsInProgress( false );
			onFinishEditing();
			return;
		}

		const modifierType =
			modifiers.length === 1 ? modifiers[ 0 ].type : 'cropAndRotate';

		apiFetch( {
			path: `/wp/v2/media/${ id }/edit`,
			method: 'POST',
			data: { src: url, modifiers },
		} )
			.then( ( response ) => {
				onSaveImage( {
					id: response.id,
					url: response.source_url,
				} );
				createSuccessNotice( messages[ modifierType ], {
					type: 'snackbar',
					actions: [
						{
							label: __( 'Undo' ),
							onClick: () => {
								onSaveImage( {
									id,
									url,
								} );
							},
						},
					],
				} );
			} )
			.catch( ( error ) => {
				createErrorNotice(
					sprintf(
						/* translators: %s: Error message. */
						__( 'Could not edit image. %s' ),
						stripHTML( error.message )
					),
					{
						id: 'image-editing-error',
						type: 'snackbar',
					}
				);
			} )
			.finally( () => {
				setIsInProgress( false );
				onFinishEditing();
			} );
	}, [
		crop,
		rotation,
		id,
		url,
		onSaveImage,
		createErrorNotice,
		createSuccessNotice,
		onFinishEditing,
	] );

	return useMemo(
		() => ( {
			isInProgress,
			apply,
			cancel,
		} ),
		[ isInProgress, apply, cancel ]
	);
}
