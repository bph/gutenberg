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

export const postsListViewRoute = {
	name: 'posts-list-view',
	match: ( params ) => {
		return (
			params.isCustom !== 'true' &&
			( params.layout ?? 'list' ) === 'list' &&
			! params.quickEdit &&
			params.postType === 'post' &&
			params.canvas !== 'edit'
		);
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
		preview: <Editor isPostsList />,
		mobile: <PostList postType="post" />,
	},
	widths: {
		content: 380,
	},
};
