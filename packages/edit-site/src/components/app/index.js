/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Layout from '../layout';
import { unlock } from '../../lock-unlock';
import { store as editSiteStore } from '../../store';
import { useCommonCommands } from '../../hooks/commands/use-common-commands';
import useSetCommandContext from '../../hooks/commands/use-set-command-context';
import { useRegisterSiteEditorRoutes } from '../site-editor-routes';
import {
	currentlyPreviewingTheme,
	isPreviewingTheme,
} from '../../utils/is-previewing-theme';

const { RouterProvider } = unlock( routerPrivateApis );

function AppLayout() {
	useCommonCommands();
	useSetCommandContext();

	return <Layout />;
}

export default function App() {
	useRegisterSiteEditorRoutes();
	const routes = useSelect( ( select ) => {
		return unlock( select( editSiteStore ) ).getRoutes();
	}, [] );
	const beforeNavigate = useCallback( ( { path, query } ) => {
		if ( ! isPreviewingTheme() ) {
			return { path, query };
		}

		return {
			path,
			query: {
				...query,
				wp_theme_preview:
					'wp_theme_preview' in query
						? query.wp_theme_preview
						: currentlyPreviewingTheme(),
			},
		};
	}, [] );

	return (
		<RouterProvider
			routes={ routes }
			pathArg="p"
			beforeNavigate={ beforeNavigate }
		>
			<AppLayout />
		</RouterProvider>
	);
}
