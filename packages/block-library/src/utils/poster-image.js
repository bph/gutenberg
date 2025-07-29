/**
 * External dependencies
 */
import clsx from 'clsx';

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

const POSTER_IMAGE_ALLOWED_MEDIA_TYPES = [ 'image' ];

function PosterImage( { poster, onChange } ) {
	const posterButtonRef = useRef();
	const descriptionId = useInstanceId(
		PosterImage,
		'block-library-poster-image-description'
	);

	return (
		<MediaUploadCheck>
			<ToolsPanelItem
				label={ __( 'Poster image' ) }
				isShownByDefault
				hasValue={ () => !! poster }
				onDeselect={ () => onChange( undefined ) }
			>
				<BaseControl.VisualLabel>
					{ __( 'Poster image' ) }
				</BaseControl.VisualLabel>
				<MediaUpload
					title={ __( 'Select poster image' ) }
					onSelect={ onChange }
					allowedTypes={ POSTER_IMAGE_ALLOWED_MEDIA_TYPES }
					render={ ( { open } ) => (
						<div className="block-library-poster-image__container">
							{ poster && (
								<Button
									__next40pxDefaultSize
									onClick={ open }
									aria-haspopup="dialog"
									aria-label={
										! poster
											? null
											: __(
													'Edit or replace the poster image.'
											  )
									}
									className={
										poster
											? 'block-library-poster-image__preview'
											: 'block-library-poster-image__toggle'
									}
								>
									<img
										src={ poster }
										alt={ __( 'Poster image preview' ) }
										className="block-library-poster-image__preview-image"
									/>
								</Button>
							) }
							<HStack
								className={ clsx(
									'block-library-poster-image__actions',
									{
										'block-library-poster-image__actions-select':
											! poster,
									}
								) }
							>
								<Button
									__next40pxDefaultSize
									onClick={ open }
									ref={ posterButtonRef }
									className="block-library-poster-image__action"
									aria-describedby={ descriptionId }
									aria-haspopup="dialog"
									variant={
										! poster ? 'secondary' : undefined
									}
								>
									{ ! poster
										? __( 'Set poster image' )
										: __( 'Replace' ) }
								</Button>
								<p id={ descriptionId } hidden>
									{ poster
										? sprintf(
												/* translators: %s: poster image URL. */
												__(
													'The current poster image url is %s.'
												),
												poster
										  )
										: __(
												'There is no poster image currently selected.'
										  ) }
								</p>
								{ !! poster && (
									<Button
										__next40pxDefaultSize
										onClick={ () => {
											onChange( undefined );

											// Move focus back to the Media Upload button.
											posterButtonRef.current.focus();
										} }
										className="block-library-poster-image__action"
									>
										{ __( 'Remove' ) }
									</Button>
								) }
							</HStack>
						</div>
					) }
				/>
			</ToolsPanelItem>
		</MediaUploadCheck>
	);
}

export default PosterImage;
