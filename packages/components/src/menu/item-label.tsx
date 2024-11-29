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

export const MenuItemLabel = forwardRef<
	HTMLSpanElement,
	WordPressComponentProps< { children: React.ReactNode }, 'span', true >
>( function MenuItemLabel( props, ref ) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.ItemLabel can only be rendered inside a Menu component'
		);
	}

	return (
		<Styled.MenuItemLabel numberOfLines={ 1 } ref={ ref } { ...props } />
	);
} );
