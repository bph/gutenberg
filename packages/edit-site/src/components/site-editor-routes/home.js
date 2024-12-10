/**
 * Internal dependencies
 */
import SidebarNavigationScreenMain from '../sidebar-navigation-screen-main';
import { MaybeEditor } from '../maybe-editor';

export const homeRoute = {
	name: 'home',
	path: '/',
	areas: {
		sidebar: <SidebarNavigationScreenMain />,
		preview: <MaybeEditor showEditor={ false } />,
		mobile: <SidebarNavigationScreenMain />,
	},
};
