/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PostList from '../post-list';
import DataViewsSidebarContent from '../sidebar-dataviews';
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import Editor from '../editor';

export const postsEditRoute = {
	name: 'posts-edit',
	match: ( params ) => {
		return params.postType === 'post' && params.canvas === 'edit';
	},
	areas: {
		sidebar: (
			<SidebarNavigationScreen
				title={ __( 'Posts' ) }
				isRoot
				content={ <DataViewsSidebarContent /> }
			/>
		),
		content: <PostList postType="post" />,
		mobile: <Editor isPostsList />,
		preview: <Editor isPostsList />,
	},
};
