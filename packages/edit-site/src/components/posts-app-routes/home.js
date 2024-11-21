/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenMain from '../sidebar-navigation-screen-main';
import { unlock } from '../../lock-unlock';

const { useLocation } = unlock( routerPrivateApis );

function HomeMobileView() {
	const { params = {} } = useLocation();
	const { canvas = 'view' } = params;

	return canvas === 'edit' ? (
		<Editor isPostsList />
	) : (
		<SidebarNavigationScreenMain />
	);
}

export const homeRoute = {
	name: 'home',
	match: () => {
		return true;
	},
	areas: {
		sidebar: <SidebarNavigationScreenMain />,
		preview: <Editor isPostsList />,
		mobile: HomeMobileView,
	},
};
