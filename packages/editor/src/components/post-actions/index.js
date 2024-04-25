/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	privateApis as componentsPrivateApis,
	Button,
	Modal,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { usePostActions } from './actions';
import { store as editorStore } from '../../store';
import {
	TEMPLATE_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
	PATTERN_POST_TYPE,
} from '../../store/constants';

const {
	DropdownMenuV2: DropdownMenu,
	DropdownMenuGroupV2: DropdownMenuGroup,
	DropdownMenuItemV2: DropdownMenuItem,
	DropdownMenuItemLabelV2: DropdownMenuItemLabel,
	kebabCase,
} = unlock( componentsPrivateApis );

const POST_ACTIONS_WHILE_EDITING = [
	'view-post',
	'view-post-revisions',
	'duplicate-post',
	'rename-post',
	'move-to-trash',
];

export default function PostActions( { onActionPerformed, buttonProps } ) {
	const [ isActionsMenuOpen, setIsActionsMenuOpen ] = useState( false );
	const { postType, item } = useSelect( ( select ) => {
		const { getCurrentPostType, getCurrentPost } = select( editorStore );
		return {
			postType: getCurrentPostType(),
			item: getCurrentPost(),
		};
	} );
	const allActions = usePostActions(
		onActionPerformed,
		POST_ACTIONS_WHILE_EDITING
	);

	const actions = useMemo( () => {
		return allActions.filter( ( action ) => {
			return ! action.isEligible || action.isEligible( item );
		} );
	}, [ allActions, item ] );

	if (
		[
			TEMPLATE_POST_TYPE,
			TEMPLATE_PART_POST_TYPE,
			PATTERN_POST_TYPE,
		].includes( postType )
	) {
		return null;
	}
	return (
		<DropdownMenu
			open={ isActionsMenuOpen }
			trigger={
				<Button
					size="small"
					icon={ moreVertical }
					label={ __( 'Actions' ) }
					disabled={ ! actions.length }
					className="editor-all-actions-button"
					onClick={ () =>
						setIsActionsMenuOpen( ! isActionsMenuOpen )
					}
					{ ...buttonProps }
				/>
			}
			onOpenChange={ setIsActionsMenuOpen }
			placement="bottom-end"
		>
			<ActionsDropdownMenuGroup
				actions={ actions }
				item={ item }
				onClose={ () => {
					setIsActionsMenuOpen( false );
				} }
			/>
		</DropdownMenu>
	);
}

// From now on all the functions on this file are copied as from the dataviews packages,
// The editor packages should not be using the dataviews packages directly,
// and the dataviews package should not be using the editor packages directly,
// so duplicating the code here seems like the least bad option.

// Copied as is from packages/dataviews/src/item-actions.js
function DropdownMenuItemTrigger( { action, onClick } ) {
	return (
		<DropdownMenuItem
			onClick={ onClick }
			hideOnClick={ ! action.RenderModal }
		>
			<DropdownMenuItemLabel>{ action.label }</DropdownMenuItemLabel>
		</DropdownMenuItem>
	);
}

// Copied as is from packages/dataviews/src/item-actions.js
// With an added onClose prop.
function ActionWithModal( { action, item, ActionTrigger, onClose } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const actionTriggerProps = {
		action,
		onClick: () => setIsModalOpen( true ),
	};
	const { RenderModal, hideModalHeader } = action;
	return (
		<>
			<ActionTrigger { ...actionTriggerProps } />
			{ isModalOpen && (
				<Modal
					title={ action.modalHeader || action.label }
					__experimentalHideHeader={ !! hideModalHeader }
					onRequestClose={ () => {
						setIsModalOpen( false );
					} }
					overlayClassName={ `editor-action-modal editor-action-modal__${ kebabCase(
						action.id
					) }` }
				>
					<RenderModal
						items={ [ item ] }
						closeModal={ () => {
							setIsModalOpen( false );
							onClose();
						} }
					/>
				</Modal>
			) }
		</>
	);
}

// Copied as is from packages/dataviews/src/item-actions.js
// With an added onClose prop.
function ActionsDropdownMenuGroup( { actions, item, onClose } ) {
	return (
		<DropdownMenuGroup>
			{ actions.map( ( action ) => {
				if ( action.RenderModal ) {
					return (
						<ActionWithModal
							key={ action.id }
							action={ action }
							item={ item }
							ActionTrigger={ DropdownMenuItemTrigger }
							onClose={ onClose }
						/>
					);
				}
				return (
					<DropdownMenuItemTrigger
						key={ action.id }
						action={ action }
						onClick={ () => action.callback( [ item ] ) }
					/>
				);
			} ) }
		</DropdownMenuGroup>
	);
}
