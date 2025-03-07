/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import FlatTermSelector from '../post-taxonomies/flat-term-selector';
import { store as editorStore } from '../../store';

const TagsPanel = () => {
	const panelBodyTitle = [
		__( 'Suggestion:' ),
		<span className="editor-post-publish-panel__link" key="label">
			{ __( 'Add tags' ) }
		</span>,
	];

	return (
		<PanelBody initialOpen={ false } title={ panelBodyTitle }>
			<p>
				{ __(
					'Tags help users and search engines navigate your site and find your content. Add a few keywords to describe your post.'
				) }
			</p>
			<FlatTermSelector slug="post_tag" __nextHasNoMarginBottom />
		</PanelBody>
	);
};

const MaybeTagsPanel = () => {
	const { postHasTags, siteHasTags, isPostTypeSupported } = useSelect(
		( select ) => {
			const postType = select( editorStore ).getCurrentPostType();
			const tagsTaxonomy = select( coreStore ).getEntityRecord(
				'root',
				'taxonomy',
				'post_tag'
			);
			const _isPostTypeSupported =
				tagsTaxonomy?.types?.includes( postType );
			const areTagsFetched = tagsTaxonomy !== undefined;
			const tags =
				tagsTaxonomy &&
				select( editorStore ).getEditedPostAttribute(
					tagsTaxonomy.rest_base
				);
			const siteTags = _isPostTypeSupported
				? !! select( coreStore ).getEntityRecords(
						'taxonomy',
						'post_tag',
						{ per_page: 1 }
				  )?.length
				: false;

			return {
				postHasTags: !! tags?.length,
				siteHasTags: siteTags,
				isPostTypeSupported: areTagsFetched && _isPostTypeSupported,
			};
		},
		[]
	);
	const [ hadTagsWhenOpeningThePanel ] = useState( postHasTags );

	/**
	 * We only want to show the tag panel if the post type supports
	 * tags and the site has tags.
	 */
	if ( ! isPostTypeSupported || ! siteHasTags ) {
		return null;
	}

	/*
	 * We only want to show the tag panel if the post didn't have
	 * any tags when the user hit the Publish button.
	 *
	 * We can't use the prop.postHasTags because it'll change to true
	 * if the user adds a new tag within the pre-publish panel.
	 * This would force a re-render and a new prop.postHasTags check,
	 * hiding this panel and keeping the user from adding
	 * more than one tag.
	 */
	if ( ! hadTagsWhenOpeningThePanel ) {
		return <TagsPanel />;
	}

	return null;
};

export default MaybeTagsPanel;
