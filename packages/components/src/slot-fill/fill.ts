/**
 * WordPress dependencies
 */
import { useContext, useLayoutEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SlotFillContext from './context';
import useSlot from './use-slot';
import type { FillComponentProps } from './types';

export default function Fill( { name, children }: FillComponentProps ) {
	const registry = useContext( SlotFillContext );
	const slot = useSlot( name );

	const ref = useRef( {
		name,
		children,
	} );

	useLayoutEffect( () => {
		const refValue = ref.current;
		refValue.name = name;
		registry.registerFill( name, refValue );
		return () => registry.unregisterFill( name, refValue );
	}, [ registry, name ] );

	useLayoutEffect( () => {
		ref.current.children = children;
		if ( slot ) {
			slot.rerender();
		}
	}, [ slot, children ] );

	return null;
}
