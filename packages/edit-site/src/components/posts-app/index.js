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
import useActiveRoute from './router';
import { unlock } from '../../lock-unlock';

const { RouterProvider } = unlock( routerPrivateApis );
const { GlobalStylesProvider } = unlock( editorPrivateApis );

function PostsLayout() {
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
