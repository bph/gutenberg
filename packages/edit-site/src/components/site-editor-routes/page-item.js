/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Editor from '../editor';
import DataViewsSidebarContent from '../sidebar-dataviews';
import SidebarNavigationScreen from '../sidebar-navigation-screen';

export const pageItemRoute = {
	name: 'page-item',
	path: '/page/:postId',
	areas: {
		sidebar: (
			<SidebarNavigationScreen
				title={ __( 'Pages' ) }
				backPath="/"
				content={ <DataViewsSidebarContent postType="page" /> }
			/>
		),
		mobile: <Editor />,
		preview: <Editor />,
	},
};
