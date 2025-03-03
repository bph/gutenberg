/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import SidebarNavigationScreenPatterns from '../sidebar-navigation-screen-patterns';
import PagePatterns from '../page-patterns';
import { unlock } from '../../lock-unlock';

const { useLocation } = unlock( routerPrivateApis );

function MobilePatternsView() {
	const { query = {} } = useLocation();
	const { categoryId } = query;

	return !! categoryId ? (
		<PagePatterns />
	) : (
		<SidebarNavigationScreenPatterns backPath="/" />
	);
}

export const patternsRoute = {
	name: 'patterns',
	path: '/pattern',
	areas: {
		sidebar: <SidebarNavigationScreenPatterns backPath="/" />,
		content: <PagePatterns />,
		mobile: <MobilePatternsView />,
	},
};
