/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DataForm } from '@wordpress/dataviews';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { __experimentalVStack as VStack } from '@wordpress/components';
import { useState, useMemo, useEffect } from '@wordpress/element';
import { privateApis as editorPrivateApis } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Page from '../page';
import { unlock } from '../../lock-unlock';

const { PostCardPanel, usePostFields } = unlock( editorPrivateApis );

const fieldsWithBulkEditSupport = [
	'title',
	'status',
	'date',
	'author',
	'comment_status',
];

function PostEditForm( { postType, postId } ) {
	const ids = useMemo( () => postId.split( ',' ), [ postId ] );
	const { record } = useSelect(
		( select ) => {
			return {
				record:
					ids.length === 1
						? select( coreDataStore ).getEditedEntityRecord(
								'postType',
								postType,
								ids[ 0 ]
						  )
						: null,
			};
		},
		[ postType, ids ]
	);
	const [ multiEdits, setMultiEdits ] = useState( {} );
	const { editEntityRecord } = useDispatch( coreDataStore );
	const { fields: _fields } = usePostFields();
	const fields = useMemo(
		() =>
			_fields?.map( ( field ) => {
				if ( field.id === 'status' ) {
					return {
						...field,
						elements: field.elements.filter(
							( element ) => element.value !== 'trash'
						),
					};
				}
				return field;
			} ),
		[ _fields ]
	);

	const form = useMemo(
		() => ( {
			type: 'panel',
			fields: [
				{
					id: 'featured_media',
					layout: 'regular',
				},
				'title',
				{
					id: 'status',
					label: __( 'Status & Visibility' ),
					children: [ 'status', 'password' ],
				},
				'author',
				'date',
				'slug',
				'parent',
				'comment_status',
			].filter(
				( field ) =>
					ids.length === 1 ||
					fieldsWithBulkEditSupport.includes( field )
			),
		} ),
		[ ids ]
	);
	const onChange = ( edits ) => {
		for ( const id of ids ) {
			if (
				edits.status &&
				edits.status !== 'future' &&
				record?.status === 'future' &&
				new Date( record.date ) > new Date()
			) {
				edits.date = null;
			}
			if (
				edits.status &&
				edits.status === 'private' &&
				record.password
			) {
				edits.password = '';
			}
			editEntityRecord( 'postType', postType, id, edits );
			if ( ids.length > 1 ) {
				setMultiEdits( ( prev ) => ( {
					...prev,
					...edits,
				} ) );
			}
		}
	};
	useEffect( () => {
		setMultiEdits( {} );
	}, [ ids ] );

	return (
		<VStack spacing={ 4 }>
			{ ids.length === 1 && (
				<PostCardPanel postType={ postType } postId={ ids[ 0 ] } />
			) }
			<DataForm
				data={ ids.length === 1 ? record : multiEdits }
				fields={ fields }
				form={ form }
				onChange={ onChange }
			/>
		</VStack>
	);
}

export function PostEdit( { postType, postId } ) {
	return (
		<Page
			className={ clsx( 'edit-site-post-edit', {
				'is-empty': ! postId,
			} ) }
			label={ __( 'Post Edit' ) }
		>
			{ postId && (
				<PostEditForm postType={ postType } postId={ postId } />
			) }
			{ ! postId && <p>{ __( 'Select a page to edit' ) }</p> }
		</Page>
	);
}
