/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ComboboxControl,
	SelectControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

const minimumUsersForCombobox = 25;

const AUTHORS_QUERY = {
	who: 'authors',
	per_page: 100,
};

function PostAuthorEdit( {
	isSelected,
	context: { postType, postId, queryId },
	attributes,
	setAttributes,
} ) {
	const isDescendentOfQueryLoop = Number.isFinite( queryId );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { authorId, authorDetails, authors, supportsAuthor } = useSelect(
		( select ) => {
			const { getEditedEntityRecord, getUser, getUsers, getPostType } =
				select( coreStore );
			const _authorId = getEditedEntityRecord(
				'postType',
				postType,
				postId
			)?.author;

			return {
				authorId: _authorId,
				authorDetails: _authorId ? getUser( _authorId ) : null,
				authors: getUsers( AUTHORS_QUERY ),
				supportsAuthor:
					getPostType( postType )?.supports?.author ?? false,
			};
		},
		[ postType, postId ]
	);

	const { editEntityRecord } = useDispatch( coreStore );

	const {
		textAlign,
		showAvatar,
		showBio,
		byline,
		isLink,
		linkTarget,
		avatarSize,
	} = attributes;
	const avatarSizes = [];
	const authorName = authorDetails?.name || __( 'Post Author' );
	if ( authorDetails?.avatar_urls ) {
		Object.keys( authorDetails.avatar_urls ).forEach( ( size ) => {
			avatarSizes.push( {
				value: size,
				label: `${ size } x ${ size }`,
			} );
		} );
	}

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const authorOptions = authors?.length
		? authors.map( ( { id, name } ) => {
				return {
					value: id,
					label: name,
				};
		  } )
		: [];

	const handleSelect = ( nextAuthorId ) => {
		editEntityRecord( 'postType', postType, postId, {
			author: nextAuthorId,
		} );
	};

	const showCombobox = authorOptions.length >= minimumUsersForCombobox;
	const showAuthorControl =
		!! postId && ! isDescendentOfQueryLoop && authorOptions.length > 0;

	if ( ! supportsAuthor && postType !== undefined ) {
		return (
			<div { ...blockProps }>
				{ sprintf(
					// translators: %s: Name of the post type e.g: "post".
					__( 'This post type (%s) does not support the author.' ),
					postType
				) }
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							avatarSize: 48,
							showAvatar: true,
							isLink: false,
							linkTarget: '_self',
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					{ showAuthorControl && (
						<div style={ { gridColumn: '1 / -1' } }>
							{ ( showCombobox && (
								<ComboboxControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Author' ) }
									options={ authorOptions }
									value={ authorId }
									onChange={ handleSelect }
									allowReset={ false }
								/>
							) ) || (
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Author' ) }
									value={ authorId }
									options={ authorOptions }
									onChange={ handleSelect }
								/>
							) }
						</div>
					) }
					<ToolsPanelItem
						label={ __( 'Show avatar' ) }
						isShownByDefault
						hasValue={ () => ! showAvatar }
						onDeselect={ () =>
							setAttributes( { showAvatar: true } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Show avatar' ) }
							checked={ showAvatar }
							onChange={ () =>
								setAttributes( {
									showAvatar: ! showAvatar,
								} )
							}
						/>
					</ToolsPanelItem>
					{ showAvatar && (
						<ToolsPanelItem
							label={ __( 'Avatar size' ) }
							isShownByDefault
							hasValue={ () => avatarSize !== 48 }
							onDeselect={ () =>
								setAttributes( { avatarSize: 48 } )
							}
						>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Avatar size' ) }
								value={ avatarSize }
								options={ avatarSizes }
								onChange={ ( size ) => {
									setAttributes( {
										avatarSize: Number( size ),
									} );
								} }
							/>
						</ToolsPanelItem>
					) }
					<ToolsPanelItem
						label={ __( 'Show bio' ) }
						isShownByDefault
						hasValue={ () => !! showBio }
						onDeselect={ () =>
							setAttributes( { showBio: undefined } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Show bio' ) }
							checked={ !! showBio }
							onChange={ () =>
								setAttributes( { showBio: ! showBio } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Link author name to author page' ) }
						isShownByDefault
						hasValue={ () => !! isLink }
						onDeselect={ () => setAttributes( { isLink: false } ) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Link author name to author page' ) }
							checked={ isLink }
							onChange={ () =>
								setAttributes( { isLink: ! isLink } )
							}
						/>
					</ToolsPanelItem>
					{ isLink && (
						<ToolsPanelItem
							label={ __( 'Link target' ) }
							isShownByDefault
							hasValue={ () => linkTarget !== '_self' }
							onDeselect={ () =>
								setAttributes( { linkTarget: '_self' } )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Open in new tab' ) }
								onChange={ ( value ) =>
									setAttributes( {
										linkTarget: value ? '_blank' : '_self',
									} )
								}
								checked={ linkTarget === '_blank' }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<div { ...blockProps }>
				{ showAvatar && authorDetails?.avatar_urls && (
					<div className="wp-block-post-author__avatar">
						<img
							width={ avatarSize }
							src={ authorDetails.avatar_urls[ avatarSize ] }
							alt={ authorDetails.name }
						/>
					</div>
				) }
				<div className="wp-block-post-author__content">
					{ ( ! RichText.isEmpty( byline ) || isSelected ) && (
						<RichText
							identifier="byline"
							className="wp-block-post-author__byline"
							aria-label={ __( 'Post author byline text' ) }
							placeholder={ __( 'Write byline…' ) }
							value={ byline }
							onChange={ ( value ) =>
								setAttributes( { byline: value } )
							}
						/>
					) }
					<p className="wp-block-post-author__name">
						{ isLink ? (
							<a
								href="#post-author-pseudo-link"
								onClick={ ( event ) => event.preventDefault() }
							>
								{ authorName }
							</a>
						) : (
							authorName
						) }
					</p>
					{ showBio && (
						<p
							className="wp-block-post-author__bio"
							dangerouslySetInnerHTML={ {
								__html: authorDetails?.description,
							} }
						/>
					) }
				</div>
			</div>
		</>
	);
}

export default PostAuthorEdit;
