/**
 * WordPress dependencies
 */
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { PluginArea } from '@wordpress/plugins';
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
	const { createErrorNotice } = useDispatch( noticesStore );
	const routes = useSelect( ( select ) => {
		return unlock( select( editSiteStore ) ).getRoutes();
	}, [] );
	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}
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
			<PluginArea onError={ onPluginAreaError } />
		</RouterProvider>
	);
}
