/**
 * External dependencies
 */
import type { ReactElement, ReactNode, Key } from 'react';

/**
 * WordPress dependencies
 */
import {
	useContext,
	useEffect,
	useReducer,
	useRef,
	Children,
	cloneElement,
	isEmptyElement,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import SlotFillContext from './context';
import type { SlotComponentProps } from './types';

/**
 * Whether the argument is a function.
 *
 * @param maybeFunc The argument to check.
 * @return True if the argument is a function, false otherwise.
 */
function isFunction( maybeFunc: any ): maybeFunc is Function {
	return typeof maybeFunc === 'function';
}

function Slot( props: Omit< SlotComponentProps, 'bubblesVirtually' > ) {
	const registry = useContext( SlotFillContext );
	const [ , rerender ] = useReducer( () => [], [] );
	const ref = useRef( { rerender } );

	const { name, children, fillProps = {} } = props;

	useEffect( () => {
		const refValue = ref.current;
		registry.registerSlot( name, refValue );
		return () => registry.unregisterSlot( name, refValue );
	}, [ registry, name ] );

	const fills: ReactNode[] = ( registry.getFills( name, ref.current ) ?? [] )
		.map( ( fill ) => {
			const fillChildren = isFunction( fill.children )
				? fill.children( fillProps )
				: fill.children;
			return Children.map( fillChildren, ( child, childIndex ) => {
				if ( ! child || typeof child === 'string' ) {
					return child;
				}
				let childKey: Key = childIndex;
				if (
					typeof child === 'object' &&
					'key' in child &&
					child?.key
				) {
					childKey = child.key;
				}

				return cloneElement( child as ReactElement, {
					key: childKey,
				} );
			} );
		} )
		.filter(
			// In some cases fills are rendered only when some conditions apply.
			// This ensures that we only use non-empty fills when rendering, i.e.,
			// it allows us to render wrappers only when the fills are actually present.
			( element ) => ! isEmptyElement( element )
		);

	return <>{ isFunction( children ) ? children( fills ) : fills }</>;
}

export default Slot;
