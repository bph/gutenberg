/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { forwardRef, useContext } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import { MenuContext } from './context';
import type { MenuRadioItemProps } from './types';
import * as Styled from './styles';
import { SVG, Circle } from '@wordpress/primitives';

const radioCheck = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Circle cx={ 12 } cy={ 12 } r={ 3 }></Circle>
	</SVG>
);

export const MenuRadioItem = forwardRef<
	HTMLDivElement,
	WordPressComponentProps< MenuRadioItemProps, 'div', false >
>( function MenuRadioItem(
	{ suffix, children, disabled = false, hideOnClick = false, ...props },
	ref
) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.RadioItem can only be rendered inside a Menu component'
		);
	}

	return (
		<Styled.MenuRadioItem
			ref={ ref }
			{ ...props }
			accessibleWhenDisabled
			disabled={ disabled }
			hideOnClick={ hideOnClick }
			store={ menuContext.store }
		>
			<Ariakit.MenuItemCheck
				store={ menuContext.store }
				render={ <Styled.ItemPrefixWrapper /> }
				// Override some ariakit inline styles
				style={ { width: 'auto', height: 'auto' } }
			>
				<Icon icon={ radioCheck } size={ 24 } />
			</Ariakit.MenuItemCheck>

			<Styled.MenuItemContentWrapper>
				<Styled.MenuItemChildrenWrapper>
					{ children }
				</Styled.MenuItemChildrenWrapper>

				{ suffix && (
					<Styled.ItemSuffixWrapper>
						{ suffix }
					</Styled.ItemSuffixWrapper>
				) }
			</Styled.MenuItemContentWrapper>
		</Styled.MenuRadioItem>
	);
} );
