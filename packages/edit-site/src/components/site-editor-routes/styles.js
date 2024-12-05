/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Editor from '../editor';
import { unlock } from '../../lock-unlock';
import SidebarNavigationScreenGlobalStyles from '../sidebar-navigation-screen-global-styles';
import GlobalStylesUIWrapper from '../sidebar-global-styles-wrapper';

const { useLocation } = unlock( routerPrivateApis );

function MobileGlobalStylesUI() {
	const { query = {} } = useLocation();
	const { canvas } = query;

	if ( canvas === 'edit' ) {
		return <Editor />;
	}

	return <GlobalStylesUIWrapper />;
}

export const stylesRoute = {
	name: 'styles',
	path: '/styles',
	areas: {
		content: <GlobalStylesUIWrapper />,
		sidebar: <SidebarNavigationScreenGlobalStyles backPath="/" />,
		preview: <Editor />,
		mobile: <MobileGlobalStylesUI />,
	},
	widths: {
		content: 380,
	},
};
