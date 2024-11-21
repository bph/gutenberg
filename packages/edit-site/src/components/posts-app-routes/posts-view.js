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

export const postsViewRoute = {
	name: 'posts-view',
	match: ( params ) => {
		return (
			( params.isCustom === 'true' ||
				( params.layout ?? 'list' ) !== 'list' ) &&
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
		mobile: <PostList postType="post" />,
	},
};
