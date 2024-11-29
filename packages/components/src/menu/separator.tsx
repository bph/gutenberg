/**
 * WordPress dependencies
 */
import { forwardRef, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import { MenuContext } from './context';
import type { MenuSeparatorProps } from './types';
import * as Styled from './styles';

export const MenuSeparator = forwardRef<
	HTMLHRElement,
	WordPressComponentProps< MenuSeparatorProps, 'hr', false >
>( function MenuSeparator( props, ref ) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.Separator can only be rendered inside a Menu component'
		);
	}

	return (
		<Styled.MenuSeparator
			ref={ ref }
			{ ...props }
			store={ menuContext.store }
			variant={ menuContext.variant }
		/>
	);
} );
