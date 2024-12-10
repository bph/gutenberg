/**
 * Internal dependencies
 */
import { MaybeEditor } from '../maybe-editor';
import SidebarNavigationScreenTemplatesBrowse from '../sidebar-navigation-screen-templates-browse';

export const templateItemRoute = {
	name: 'template-item',
	path: '/wp_template/*postId',
	areas: {
		sidebar: <SidebarNavigationScreenTemplatesBrowse backPath="/" />,
		mobile: <MaybeEditor />,
		preview: <MaybeEditor />,
	},
};
