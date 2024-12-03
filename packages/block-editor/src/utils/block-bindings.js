/**
 * WordPress dependencies
 */
import { useDispatch, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../store';
import { useBlockEditContext } from '../components/block-edit';

function isObjectEmpty( object ) {
	return ! object || Object.keys( object ).length === 0;
}

export const BLOCK_BINDINGS_ALLOWED_BLOCKS = {
	'core/paragraph': [ 'content' ],
	'core/heading': [ 'content' ],
	'core/image': [ 'id', 'url', 'title', 'alt' ],
	'core/button': [ 'url', 'text', 'linkTarget', 'rel' ],
};

/**
 * Based on the given block name,
 * check if it is possible to bind the block.
 *
 * @param {string} blockName - The block name.
 * @return {boolean} Whether it is possible to bind the block to sources.
 */
export function canBindBlock( blockName ) {
	return blockName in BLOCK_BINDINGS_ALLOWED_BLOCKS;
}

/**
 * Based on the given block name and attribute name,
 * check if it is possible to bind the block attribute.
 *
 * @param {string} blockName     - The block name.
 * @param {string} attributeName - The attribute name.
 * @return {boolean} Whether it is possible to bind the block attribute.
 */
export function canBindAttribute( blockName, attributeName ) {
	return (
		canBindBlock( blockName ) &&
		BLOCK_BINDINGS_ALLOWED_BLOCKS[ blockName ].includes( attributeName )
	);
}

export function getBindableAttributes( blockName ) {
	return BLOCK_BINDINGS_ALLOWED_BLOCKS[ blockName ];
}

/**
 * Contains utils to update the block `bindings` metadata.
 *
 * @typedef {Object} WPBlockBindingsUtils
 *
 * @property {Function} updateBlockBindings    Updates the value of the bindings connected to block attributes.
 * @property {Function} removeAllBlockBindings Removes the bindings property of the `metadata` attribute.
 */

/**
 * Retrieves the existing utils needed to update the block `bindings` metadata.
 * They can be used to create, modify, or remove connections from the existing block attributes.
 *
 * It contains the following utils:
 * - `updateBlockBindings`: Updates the value of the bindings connected to block attributes. It can be used to remove a specific binding by setting the value to `undefined`.
 * - `removeAllBlockBindings`: Removes the bindings property of the `metadata` attribute.
 *
 * @since 6.7.0 Introduced in WordPress core.
 *
 * @param {?string} clientId Optional block client ID. If not set, it will use the current block client ID from the context.
 *
 * @return {?WPBlockBindingsUtils} Object containing the block bindings utils.
 *
 * @example
 * ```js
 * import { useBlockBindingsUtils } from '@wordpress/block-editor'
 * const { updateBlockBindings, removeAllBlockBindings } = useBlockBindingsUtils();
 *
 * // Update url and alt attributes.
 * updateBlockBindings( {
 *     url: {
 *         source: 'core/post-meta',
 *         args: {
 *             key: 'url_custom_field',
 *         },
 *     },
 *     alt: {
 *         source: 'core/post-meta',
 *         args: {
 *             key: 'text_custom_field',
 *         },
 *     },
 * } );
 *
 * // Remove binding from url attribute.
 * updateBlockBindings( { url: undefined } );
 *
 * // Remove bindings from all attributes.
 * removeAllBlockBindings();
 * ```
 */
export function useBlockBindingsUtils( clientId ) {
	const { clientId: contextClientId } = useBlockEditContext();
	const blockClientId = clientId || contextClientId;
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const { getBlockAttributes } = useRegistry().select( blockEditorStore );

	/**
	 * Updates the value of the bindings connected to block attributes.
	 * It removes the binding when the new value is `undefined`.
	 *
	 * @param {Object} bindings        Bindings including the attributes to update and the new object.
	 * @param {string} bindings.source The source name to connect to.
	 * @param {Object} [bindings.args] Object containing the arguments needed by the source.
	 *
	 * @example
	 * ```js
	 * import { useBlockBindingsUtils } from '@wordpress/block-editor'
	 *
	 * const { updateBlockBindings } = useBlockBindingsUtils();
	 * updateBlockBindings( {
	 *     url: {
	 *         source: 'core/post-meta',
	 *         args: {
	 *             key: 'url_custom_field',
	 *         },
	 * 	   },
	 *     alt: {
	 *         source: 'core/post-meta',
	 *         args: {
	 *             key: 'text_custom_field',
	 *         },
	 * 	   }
	 * } );
	 * ```
	 */
	const updateBlockBindings = ( bindings ) => {
		const { metadata: { bindings: currentBindings, ...metadata } = {} } =
			getBlockAttributes( blockClientId );
		const newBindings = { ...currentBindings };

		Object.entries( bindings ).forEach( ( [ attribute, binding ] ) => {
			if ( ! binding && newBindings[ attribute ] ) {
				delete newBindings[ attribute ];
				return;
			}
			newBindings[ attribute ] = binding;
		} );

		const newMetadata = {
			...metadata,
			bindings: newBindings,
		};

		if ( isObjectEmpty( newMetadata.bindings ) ) {
			delete newMetadata.bindings;
		}

		updateBlockAttributes( blockClientId, {
			metadata: isObjectEmpty( newMetadata ) ? undefined : newMetadata,
		} );
	};

	/**
	 * Removes the bindings property of the `metadata` attribute.
	 *
	 * @example
	 * ```js
	 * import { useBlockBindingsUtils } from '@wordpress/block-editor'
	 *
	 * const { removeAllBlockBindings } = useBlockBindingsUtils();
	 * removeAllBlockBindings();
	 * ```
	 */
	const removeAllBlockBindings = () => {
		const { metadata: { bindings, ...metadata } = {} } =
			getBlockAttributes( blockClientId );
		updateBlockAttributes( blockClientId, {
			metadata: isObjectEmpty( metadata ) ? undefined : metadata,
		} );
	};

	return { updateBlockBindings, removeAllBlockBindings };
}
