/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenNavigationMenus from '../sidebar-navigation-screen-navigation-menus';
import { unlock } from '../../lock-unlock';

const { useLocation } = unlock( routerPrivateApis );

function MobileNavigationView() {
	const { query = {} } = useLocation();
	const { canvas = 'view' } = query;

	return canvas === 'edit' ? (
		<Editor />
	) : (
		<SidebarNavigationScreenNavigationMenus backPath="/" />
	);
}

export const navigationRoute = {
	name: 'navigation',
	path: '/navigation',
	areas: {
		sidebar: <SidebarNavigationScreenNavigationMenus backPath="/" />,
		preview: <Editor />,
		mobile: <MobileNavigationView />,
	},
};
