/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenPatterns from '../sidebar-navigation-screen-patterns';

export const patternItemRoute = {
	name: 'pattern-item',
	path: '/wp_block/:postId',
	areas: {
		sidebar: <SidebarNavigationScreenPatterns backPath="/" />,
		mobile: <Editor />,
		preview: <Editor />,
	},
};
