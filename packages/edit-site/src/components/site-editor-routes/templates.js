/**
 * Internal dependencies
 */
import Editor from '../editor';
import SidebarNavigationScreenTemplatesBrowse from '../sidebar-navigation-screen-templates-browse';
import PageTemplates from '../page-templates';

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
		mobile: <PageTemplates />,
	},
	widths: {
		content( { query } ) {
			const isListView = query.layout === 'list';
			return isListView ? 380 : undefined;
		},
	},
};
