/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import PostList from '../post-list';
import DataViewsSidebarContent from '../sidebar-dataviews';
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import { unlock } from '../../lock-unlock';
import { PostEdit } from '../post-edit';

const { useLocation } = unlock( routerPrivateApis );

function PostQuickEdit() {
	const { params } = useLocation();
	return <PostEdit postType="post" postId={ params.postId } />;
}

export const postsViewQuickEditRoute = {
	name: 'posts-view-quick-edit',
	match: ( params ) => {
		return (
			( params.isCustom === 'true' ||
				( params.layout ?? 'list' ) !== 'list' ) &&
			!! params.quickEdit &&
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
		edit: <PostQuickEdit />,
	},
	widths: {
		edit: 380,
	},
};
