/**
 * WordPress dependencies
 */
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	BaseControl,
	__experimentalHStack as HStack,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

const VIDEO_POSTER_ALLOWED_MEDIA_TYPES = [ 'image' ];

function PosterImage( { poster, setAttributes } ) {
	const posterButtonRef = useRef();
	const descriptionId = useInstanceId(
		PosterImage,
		'video-block__poster-image-description'
	);

	function onSelectPoster( image ) {
		setAttributes( { poster: image.url } );
	}

	function onRemovePoster() {
		setAttributes( { poster: undefined } );

		// Move focus back to the Media Upload button.
		posterButtonRef.current.focus();
	}

	return (
		<MediaUploadCheck>
			<ToolsPanelItem
				label={ __( 'Poster image' ) }
				isShownByDefault
				hasValue={ () => !! poster }
				onDeselect={ () => {
					setAttributes( { poster: undefined } );
				} }
			>
				<BaseControl.VisualLabel>
					{ __( 'Poster image' ) }
				</BaseControl.VisualLabel>
				<HStack justify="flex-start">
					<MediaUpload
						title={ __( 'Select poster image' ) }
						onSelect={ onSelectPoster }
						allowedTypes={ VIDEO_POSTER_ALLOWED_MEDIA_TYPES }
						render={ ( { open } ) => (
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ open }
								ref={ posterButtonRef }
								aria-describedby={ descriptionId }
							>
								{ ! poster ? __( 'Select' ) : __( 'Replace' ) }
							</Button>
						) }
					/>
					<p id={ descriptionId } hidden>
						{ poster
							? sprintf(
									/* translators: %s: poster image URL. */
									__( 'The current poster image url is %s.' ),
									poster
							  )
							: __(
									'There is no poster image currently selected.'
							  ) }
					</p>
					{ !! poster && (
						<Button
							__next40pxDefaultSize
							onClick={ onRemovePoster }
							variant="tertiary"
						>
							{ __( 'Remove' ) }
						</Button>
					) }
				</HStack>
			</ToolsPanelItem>
		</MediaUploadCheck>
	);
}

export default PosterImage;
