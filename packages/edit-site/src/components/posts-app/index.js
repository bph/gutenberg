/**
 * WordPress dependencies
 */
import {
	UnsavedChangesWarning,
	privateApis as editorPrivateApis,
} from '@wordpress/editor';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Layout from '../layout';
import { useRegisterPostsAppRoutes } from '../posts-app-routes';
import { unlock } from '../../lock-unlock';
import useActiveRoute from '../layout/router';

const { RouterProvider } = unlock( routerPrivateApis );
const { GlobalStylesProvider } = unlock( editorPrivateApis );

function PostsLayout() {
	useRegisterPostsAppRoutes();
	const route = useActiveRoute();
	return <Layout route={ route } />;
}

export default function PostsApp() {
	return (
		<GlobalStylesProvider>
			<UnsavedChangesWarning />
			<RouterProvider>
				<PostsLayout />
			</RouterProvider>
		</GlobalStylesProvider>
	);
}
