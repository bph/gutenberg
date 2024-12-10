/**
 * Internal dependencies
 */
import { MaybeEditor } from '../maybe-editor';
import SidebarNavigationScreenPatterns from '../sidebar-navigation-screen-patterns';

export const templatePartItemRoute = {
	name: 'template-part-item',
	path: '/wp_template_part/*postId',
	areas: {
		sidebar: <SidebarNavigationScreenPatterns backPath="/" />,
		mobile: <MaybeEditor />,
		preview: <MaybeEditor />,
	},
};
