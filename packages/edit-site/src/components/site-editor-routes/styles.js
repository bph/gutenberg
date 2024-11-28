/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenGlobalStyles from '../sidebar-navigation-screen-global-styles';
import GlobalStylesUIWrapper from '../sidebar-global-styles-wrapper';

export const stylesRoute = {
	name: 'styles',
	path: '/styles',
	areas: {
		content: <GlobalStylesUIWrapper />,
		sidebar: <SidebarNavigationScreenGlobalStyles backPath="/" />,
		preview: <Editor />,
		mobile: <GlobalStylesUIWrapper />,
	},
	widths: {
		content: 380,
	},
};
