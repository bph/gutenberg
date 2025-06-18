/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

/**
 * External dependencies
 */
// eslint-disable-next-line import/no-unresolved
import name from 'test/router-script-modules-charlie';

store( 'test/router-script-modules-charlie', {
	state: {
		name,
	},
} );

const { actions } = store( 'test/router-script-modules' );
actions.pushName?.( name );
