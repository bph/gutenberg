/**
 * WordPress dependencies
 */
import { useRegistry, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as siteEditorStore } from '../../store';
import { homeRoute } from './home';
import { postsListViewQuickEditRoute } from './posts-list-view-quick-edit';
import { postsListViewRoute } from './posts-list-view';
import { postsViewQuickEditRoute } from './posts-view-quick-edit';
import { postsViewRoute } from './posts-view';
import { postsEditRoute } from './posts-edit';

const routes = [
	postsListViewQuickEditRoute,
	postsListViewRoute,
	postsViewQuickEditRoute,
	postsViewRoute,
	postsEditRoute,
	homeRoute,
];

export function useRegisterPostsAppRoutes() {
	const registry = useRegistry();
	const { registerRoute } = unlock( useDispatch( siteEditorStore ) );
	useEffect( () => {
		registry.batch( () => {
			routes.forEach( registerRoute );
		} );
	}, [ registry, registerRoute ] );
}
