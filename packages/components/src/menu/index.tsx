/**
 * External dependencies
 */
import * as Ariakit from '@ariakit/react';

/**
 * WordPress dependencies
 */
import { useContext, useMemo } from '@wordpress/element';
import { isRTL as isRTLFn } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useContextSystem, contextConnectWithoutRef } from '../context';
import type { MenuContext as MenuContextType, MenuProps } from './types';
import { MenuContext } from './context';
import { MenuItem } from './item';
import { MenuCheckboxItem } from './checkbox-item';
import { MenuRadioItem } from './radio-item';
import { MenuGroup } from './group';
import { MenuGroupLabel } from './group-label';
import { MenuSeparator } from './separator';
import { MenuItemLabel } from './item-label';
import { MenuItemHelpText } from './item-help-text';
import { MenuTriggerButton } from './trigger-button';
import { MenuSubmenuTriggerItem } from './submenu-trigger-item';
import { MenuPopover } from './popover';

const UnconnectedMenu = ( props: MenuProps ) => {
	const {
		children,
		defaultOpen = false,
		open,
		onOpenChange,
		placement,

		// From internal components context
		variant,
	} = useContextSystem<
		// @ts-expect-error TODO: missing 'className' in MenuProps
		typeof props & Pick< MenuContextType, 'variant' >
	>( props, 'Menu' );

	const parentContext = useContext( MenuContext );

	const rtl = isRTLFn();

	// If an explicit value for the `placement` prop is not passed,
	// apply a default placement of `bottom-start` for the root menu popover,
	// and of `right-start` for nested menu popovers.
	let computedPlacement =
		placement ?? ( parentContext?.store ? 'right-start' : 'bottom-start' );
	// Swap left/right in case of RTL direction
	if ( rtl ) {
		if ( /right/.test( computedPlacement ) ) {
			computedPlacement = computedPlacement.replace(
				'right',
				'left'
			) as typeof computedPlacement;
		} else if ( /left/.test( computedPlacement ) ) {
			computedPlacement = computedPlacement.replace(
				'left',
				'right'
			) as typeof computedPlacement;
		}
	}

	const menuStore = Ariakit.useMenuStore( {
		parent: parentContext?.store,
		open,
		defaultOpen,
		placement: computedPlacement,
		focusLoop: true,
		setOpen( willBeOpen ) {
			onOpenChange?.( willBeOpen );
		},
		rtl,
	} );

	const contextValue = useMemo(
		() => ( { store: menuStore, variant } ),
		[ menuStore, variant ]
	);

	return (
		<MenuContext.Provider value={ contextValue }>
			{ children }
		</MenuContext.Provider>
	);
};

export const Menu = Object.assign(
	contextConnectWithoutRef( UnconnectedMenu, 'Menu' ),
	{
		Context: Object.assign( MenuContext, {
			displayName: 'Menu.Context',
		} ),
		Item: Object.assign( MenuItem, {
			displayName: 'Menu.Item',
		} ),
		RadioItem: Object.assign( MenuRadioItem, {
			displayName: 'Menu.RadioItem',
		} ),
		CheckboxItem: Object.assign( MenuCheckboxItem, {
			displayName: 'Menu.CheckboxItem',
		} ),
		Group: Object.assign( MenuGroup, {
			displayName: 'Menu.Group',
		} ),
		GroupLabel: Object.assign( MenuGroupLabel, {
			displayName: 'Menu.GroupLabel',
		} ),
		Separator: Object.assign( MenuSeparator, {
			displayName: 'Menu.Separator',
		} ),
		ItemLabel: Object.assign( MenuItemLabel, {
			displayName: 'Menu.ItemLabel',
		} ),
		ItemHelpText: Object.assign( MenuItemHelpText, {
			displayName: 'Menu.ItemHelpText',
		} ),
		Popover: Object.assign( MenuPopover, {
			displayName: 'Menu.Popover',
		} ),
		TriggerButton: Object.assign( MenuTriggerButton, {
			displayName: 'Menu.TriggerButton',
		} ),
		SubmenuTriggerItem: Object.assign( MenuSubmenuTriggerItem, {
			displayName: 'Menu.SubmenuTriggerItem',
		} ),
	}
);

export default Menu;
