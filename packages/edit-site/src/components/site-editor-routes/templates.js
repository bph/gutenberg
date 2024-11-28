/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenTemplatesBrowse from '../sidebar-navigation-screen-templates-browse';
import { unlock } from '../../lock-unlock';
import PageTemplates from '../page-templates';

const { useLocation } = unlock( routerPrivateApis );

function MobileTemplatesView() {
	const { query = {} } = useLocation();
	const { canvas = 'view' } = query;

	return canvas === 'edit' ? (
		<Editor />
	) : (
		<SidebarNavigationScreenTemplatesBrowse backPath="/" />
	);
}

export const templatesRoute = {
	name: 'templates',
	path: '/template',
	areas: {
		sidebar: <SidebarNavigationScreenTemplatesBrowse backPath="/" />,
		content: <PageTemplates />,
		preview( { query } ) {
			const isListView = query.layout === 'list';
			return isListView ? <Editor /> : undefined;
		},
		mobile: <MobileTemplatesView />,
	},
	widths: {
		content( { query } ) {
			const isListView = query.layout === 'list';
			return isListView ? 380 : undefined;
		},
	},
};
