/**
 * WordPress dependencies
 */
import { MenuItem } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import { comment as commentIcon } from '@wordpress/icons';

import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { CommentIconSlotFill } = unlock( blockEditorPrivateApis );

const AddCommentButton = ( { onClick } ) => {
	return (
		<CommentIconSlotFill.Fill>
			<MenuItem
				icon={ commentIcon }
				onClick={ onClick }
				aria-haspopup="dialog"
			>
				{ _x( 'Comment', 'Add comment button' ) }
			</MenuItem>
		</CommentIconSlotFill.Fill>
	);
};

export default AddCommentButton;
