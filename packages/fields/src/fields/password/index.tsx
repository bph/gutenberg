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
 * This field is used to display the post password.
 */
export default passwordField;
