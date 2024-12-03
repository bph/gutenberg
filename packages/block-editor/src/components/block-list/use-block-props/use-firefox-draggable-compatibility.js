/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';

/**
 * In Firefox, the `draggable` and `contenteditable` attributes don't play well
 * together. When `contenteditable` is within a `draggable` element, selection
 * doesn't get set in the right place. The only solution is to temporarily
 * remove the `draggable` attribute clicking inside `contenteditable` elements.
 *
 * @return {Function} Cleanup function.
 */
export function useFirefoxDraggableCompatibility() {
	return useRefEffect( ( node ) => {
		function onDown( event ) {
			node.draggable = ! event.target.isContentEditable;
		}
		const { ownerDocument } = node;
		ownerDocument.addEventListener( 'pointerdown', onDown );
		return () => {
			ownerDocument.removeEventListener( 'pointerdown', onDown );
		};
	}, [] );
}
