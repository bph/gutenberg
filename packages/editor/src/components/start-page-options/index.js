/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

export default function StartPageOptions() {
	const { postId, enabled } = useSelect( ( select ) => {
		const { getCurrentPostId, getCurrentPostType } = select( editorStore );
		const preferencesModalActive =
			select( interfaceStore ).isModalActive( 'editor/preferences' );
		const choosePatternModalEnabled = select( preferencesStore ).get(
			'core',
			'enableChoosePatternModal'
		);
		return {
			postId: getCurrentPostId(),
			enabled:
				choosePatternModalEnabled &&
				! preferencesModalActive &&
				'page' === getCurrentPostType(),
		};
	}, [] );
	const { isEditedPostDirty, isEditedPostEmpty } = useSelect( editorStore );
	const { setIsInserterOpened } = useDispatch( editorStore );

	useEffect( () => {
		if ( ! enabled ) {
			return;
		}

		const isFreshPage = ! isEditedPostDirty() && isEditedPostEmpty();
		if ( isFreshPage ) {
			setIsInserterOpened( {
				tab: 'patterns',
				category: 'core/starter-content',
			} );
		}

		// Note: The `postId` ensures the effect re-runs when pages are switched without remounting the component.
		// Examples: changing pages in the List View, creating a new page via Command Palette.
	}, [
		postId,
		enabled,
		setIsInserterOpened,
		isEditedPostDirty,
		isEditedPostEmpty,
	] );

	return null;
}
