/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { forwardRef, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import type { MenuTriggerButtonProps } from './types';
import { MenuContext } from './context';

export const MenuTriggerButton = forwardRef<
	HTMLDivElement,
	WordPressComponentProps< MenuTriggerButtonProps, 'button', false >
>( function MenuTriggerButton( { children, disabled = false, ...props }, ref ) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.TriggerButton can only be rendered inside a Menu component'
		);
	}

	if ( menuContext.store.parent ) {
		throw new Error(
			'Menu.TriggerButton should not be rendered inside a nested Menu component. Use Menu.SubmenuTriggerItem instead.'
		);
	}

	return (
		<Ariakit.MenuButton
			ref={ ref }
			{ ...props }
			disabled={ disabled }
			store={ menuContext.store }
		>
			{ children }
		</Ariakit.MenuButton>
	);
} );
