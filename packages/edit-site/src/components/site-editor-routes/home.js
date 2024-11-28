/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenMain from '../sidebar-navigation-screen-main';

export const homeRoute = {
	name: 'home',
	path: '/',
	areas: {
		sidebar: <SidebarNavigationScreenMain />,
		preview: <Editor />,
		mobile: <SidebarNavigationScreenMain />,
	},
};
