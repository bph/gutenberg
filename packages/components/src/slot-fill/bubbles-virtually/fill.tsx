/**
 * WordPress dependencies
 */
import { useObservableValue } from '@wordpress/compose';
import {
	useContext,
	useReducer,
	useRef,
	useEffect,
	createPortal,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import SlotFillContext from './slot-fill-context';
import StyleProvider from '../../style-provider';
import type { FillComponentProps } from '../types';

export default function Fill( { name, children }: FillComponentProps ) {
	const registry = useContext( SlotFillContext );
	const slot = useObservableValue( registry.slots, name );
	const [ , rerender ] = useReducer( () => [], [] );
	const ref = useRef( { rerender } );

	useEffect( () => {
		// We register fills so we can keep track of their existence.
		// Some Slot implementations need to know if there're already fills
		// registered so they can choose to render themselves or not.
		const refValue = ref.current;
		registry.registerFill( name, refValue );
		return () => {
			registry.unregisterFill( name, refValue );
		};
	}, [ registry, name ] );

	if ( ! slot || ! slot.ref.current ) {
		return null;
	}

	// When using a `Fill`, the `children` will be rendered in the document of the
	// `Slot`. This means that we need to wrap the `children` in a `StyleProvider`
	// to make sure we're referencing the right document/iframe (instead of the
	// context of the `Fill`'s parent).
	const wrappedChildren = (
		<StyleProvider document={ slot.ref.current.ownerDocument }>
			{ typeof children === 'function'
				? children( slot.fillProps ?? {} )
				: children }
		</StyleProvider>
	);

	return createPortal( wrappedChildren, slot.ref.current );
}
