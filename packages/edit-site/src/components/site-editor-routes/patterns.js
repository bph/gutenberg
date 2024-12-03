/**
 * Internal dependencies
 */
import SidebarNavigationScreenPatterns from '../sidebar-navigation-screen-patterns';
import PagePatterns from '../page-patterns';

export const patternsRoute = {
	name: 'patterns',
	path: '/pattern',
	areas: {
		sidebar: <SidebarNavigationScreenPatterns backPath="/" />,
		content: <PagePatterns />,
		mobile: <PagePatterns />,
	},
};
