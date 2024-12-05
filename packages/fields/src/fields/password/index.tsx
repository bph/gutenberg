/**
 * WordPress dependencies
 */
import type { Field } from '@wordpress/dataviews';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import PasswordEdit from './edit';

const passwordField: Field< BasePost > = {
	id: 'password',
	type: 'text',
	Edit: PasswordEdit,
	enableSorting: false,
	enableHiding: false,
	isVisible: ( item ) => item.status !== 'private',
};

/**
 * Password field for BasePost.
 */
export default passwordField;
