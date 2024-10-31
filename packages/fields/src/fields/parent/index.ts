/**
 * WordPress dependencies
 */
import type { Field } from '@wordpress/dataviews';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import { __ } from '@wordpress/i18n';
import { ParentEdit } from './parent-edit';
import { ParentView } from './parent-view';

const parentField: Field< BasePost > = {
	id: 'parent',
	type: 'text',
	label: __( 'Parent' ),
	getValue: ( { item } ) => item.parent,
	Edit: ParentEdit,
	render: ParentView,
	enableSorting: true,
};

/**
 * This field is used to display the post parent.
 */
export default parentField;
