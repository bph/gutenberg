/**
 * WordPress dependencies
 */
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

export function useShouldIframe() {
	return useSelect( ( select ) => {
		const { getEditorSettings, getCurrentPostType, getDeviceType } =
			select( editorStore );
		return (
			// If the theme is block based, we ALWAYS use the iframe for
			// consistency across the post and site editor. The iframe was
			// introduced long before the sited editor and block themes, so
			// these themes are expecting it.
			getEditorSettings().__unstableIsBlockBasedTheme ||
			// For classic themes, we also still want to iframe all the special
			// editor features and modes such as device previews, zoom out, and
			// template/pattern editing.
			getDeviceType() !== 'Desktop' ||
			[ 'wp_template', 'wp_block' ].includes( getCurrentPostType() ) ||
			unlock( select( blockEditorStore ) ).isZoomOut() ||
			// Finally, still iframe the editor for classic themes if all blocks
			// are v3 (which means they are marked as iframe-compatible).
			select( blocksStore )
				.getBlockTypes()
				.every( ( type ) => type.apiVersion >= 3 )
		);
	}, [] );
}
