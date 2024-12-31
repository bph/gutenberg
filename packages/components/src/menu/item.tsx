/**
 * WordPress dependencies
 */
import { forwardRef, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { WordPressComponentProps } from '../context';
import type { MenuItemProps } from './types';
import * as Styled from './styles';
import { MenuContext } from './context';

export const MenuItem = forwardRef<
	HTMLDivElement,
	WordPressComponentProps< MenuItemProps, 'div', false >
>( function MenuItem(
	{
		prefix,
		suffix,
		children,
		disabled = false,
		hideOnClick = true,
		store,
		...props
	},
	ref
) {
	const menuContext = useContext( MenuContext );

	if ( ! menuContext?.store ) {
		throw new Error(
			'Menu.Item can only be rendered inside a Menu component'
		);
	}

	// In most cases, the menu store will be retrieved from context (ie. the store
	// created by the top-level menu component). But in rare cases (ie.
	// `Menu.SubmenuTriggerItem`), the context store wouldn't be correct. This is
	// why the component accepts a `store` prop to override the context store.
	const computedStore = store ?? menuContext.store;

	return (
		<Styled.MenuItem
			ref={ ref }
			{ ...props }
			accessibleWhenDisabled
			disabled={ disabled }
			hideOnClick={ hideOnClick }
			store={ computedStore }
		>
			<Styled.ItemPrefixWrapper>{ prefix }</Styled.ItemPrefixWrapper>

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
		</Styled.MenuItem>
	);
} );
