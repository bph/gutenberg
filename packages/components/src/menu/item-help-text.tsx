/**
 * WordPress dependencies
 */
import { forwardRef, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import { MenuContext } from './context';
import * as Styled from './styles';

export const MenuItemHelpText = forwardRef<
	HTMLSpanElement,
	WordPressComponentProps< { children: React.ReactNode }, 'span', true >
>( function MenuItemHelpText( props, ref ) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.ItemHelpText can only be rendered inside a Menu component'
		);
	}

	return (
		<Styled.MenuItemHelpText numberOfLines={ 2 } ref={ ref } { ...props } />
	);
} );
