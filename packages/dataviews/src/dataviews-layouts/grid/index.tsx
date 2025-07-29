/**
 * External dependencies
 */
import clsx from 'clsx';
import type { ComponentProps, ReactElement } from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalGrid as Grid,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Spinner,
	Flex,
	FlexItem,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import ItemActions from '../../components/dataviews-item-actions';
import DataViewsSelectionCheckbox from '../../components/dataviews-selection-checkbox';
import {
	useHasAPossibleBulkAction,
	useSomeItemHasAPossibleBulkAction,
} from '../../components/dataviews-bulk-actions';
import type {
	Action,
	NormalizedField,
	ViewGrid as ViewGridType,
	ViewGridProps,
} from '../../types';
import type { SetSelection } from '../../private-types';
import { ItemClickWrapper } from '../utils/item-click-wrapper';
import { useUpdatedPreviewSizeOnViewportChange } from './preview-size-picker';
const { Badge } = unlock( componentsPrivateApis );

interface GridItemProps< Item > {
	view: ViewGridType;
	selection: string[];
	onChangeSelection: SetSelection;
	getItemId: ( item: Item ) => string;
	onClickItem?: ( item: Item ) => void;
	renderItemLink?: (
		props: {
			item: Item;
		} & ComponentProps< 'a' >
	) => ReactElement;
	isItemClickable: ( item: Item ) => boolean;
	item: Item;
	actions: Action< Item >[];
	titleField?: NormalizedField< Item >;
	mediaField?: NormalizedField< Item >;
	descriptionField?: NormalizedField< Item >;
	regularFields: NormalizedField< Item >[];
	badgeFields: NormalizedField< Item >[];
	hasBulkActions: boolean;
}

function GridItem< Item >( {
	view,
	selection,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	renderItemLink,
	getItemId,
	item,
	actions,
	mediaField,
	titleField,
	descriptionField,
	regularFields,
	badgeFields,
	hasBulkActions,
}: GridItemProps< Item > ) {
	const { showTitle = true, showMedia = true, showDescription = true } = view;
	const hasBulkAction = useHasAPossibleBulkAction( actions, item );
	const id = getItemId( item );
	const instanceId = useInstanceId( GridItem );
	const isSelected = selection.includes( id );
	const renderedMediaField = mediaField?.render ? (
		<mediaField.render item={ item } field={ mediaField } />
	) : null;
	const renderedTitleField =
		showTitle && titleField?.render ? (
			<titleField.render item={ item } field={ titleField } />
		) : null;

	let mediaA11yProps;
	let titleA11yProps;
	if ( isItemClickable( item ) && onClickItem ) {
		if ( renderedTitleField ) {
			mediaA11yProps = {
				'aria-labelledby': `dataviews-view-grid__title-field-${ instanceId }`,
			};
			titleA11yProps = {
				id: `dataviews-view-grid__title-field-${ instanceId }`,
			};
		} else {
			mediaA11yProps = {
				'aria-label': __( 'Navigate to item' ),
			};
		}
	}

	return (
		<VStack
			spacing={ 0 }
			key={ id }
			className={ clsx( 'dataviews-view-grid__card', {
				'is-selected': hasBulkAction && isSelected,
			} ) }
			onClickCapture={ ( event ) => {
				if ( isAppleOS() ? event.metaKey : event.ctrlKey ) {
					event.stopPropagation();
					event.preventDefault();
					if ( ! hasBulkAction ) {
						return;
					}
					onChangeSelection(
						selection.includes( id )
							? selection.filter( ( itemId ) => id !== itemId )
							: [ ...selection, id ]
					);
				}
			} }
		>
			{ showMedia && renderedMediaField && (
				<ItemClickWrapper
					item={ item }
					isItemClickable={ isItemClickable }
					onClickItem={ onClickItem }
					renderItemLink={ renderItemLink }
					className="dataviews-view-grid__media"
					{ ...mediaA11yProps }
				>
					{ renderedMediaField }
				</ItemClickWrapper>
			) }
			{ hasBulkActions && showMedia && renderedMediaField && (
				<DataViewsSelectionCheckbox
					item={ item }
					selection={ selection }
					onChangeSelection={ onChangeSelection }
					getItemId={ getItemId }
					titleField={ titleField }
					disabled={ ! hasBulkAction }
				/>
			) }
			<HStack
				justify="space-between"
				className="dataviews-view-grid__title-actions"
			>
				<ItemClickWrapper
					item={ item }
					isItemClickable={ isItemClickable }
					onClickItem={ onClickItem }
					renderItemLink={ renderItemLink }
					className="dataviews-view-grid__title-field dataviews-title-field"
					{ ...titleA11yProps }
				>
					{ renderedTitleField }
				</ItemClickWrapper>
				{ !! actions?.length && (
					<ItemActions item={ item } actions={ actions } isCompact />
				) }
			</HStack>
			<VStack spacing={ 1 }>
				{ showDescription && descriptionField?.render && (
					<descriptionField.render
						item={ item }
						field={ descriptionField }
					/>
				) }
				{ !! badgeFields?.length && (
					<HStack
						className="dataviews-view-grid__badge-fields"
						spacing={ 2 }
						wrap
						alignment="top"
						justify="flex-start"
					>
						{ badgeFields.map( ( field ) => {
							return (
								<Badge
									key={ field.id }
									className="dataviews-view-grid__field-value"
								>
									<field.render
										item={ item }
										field={ field }
									/>
								</Badge>
							);
						} ) }
					</HStack>
				) }
				{ !! regularFields?.length && (
					<VStack
						className="dataviews-view-grid__fields"
						spacing={ 1 }
					>
						{ regularFields.map( ( field ) => {
							return (
								<Flex
									className="dataviews-view-grid__field"
									key={ field.id }
									gap={ 1 }
									justify="flex-start"
									expanded
									style={ { height: 'auto' } }
									direction="row"
								>
									<>
										<FlexItem className="dataviews-view-grid__field-name">
											{ field.header }
										</FlexItem>
										<FlexItem
											className="dataviews-view-grid__field-value"
											style={ { maxHeight: 'none' } }
										>
											<field.render
												item={ item }
												field={ field }
											/>
										</FlexItem>
									</>
								</Flex>
							);
						} ) }
					</VStack>
				) }
			</VStack>
		</VStack>
	);
}

function ViewGrid< Item >( {
	actions,
	data,
	fields,
	getItemId,
	isLoading,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	renderItemLink,
	selection,
	view,
	className,
}: ViewGridProps< Item > ) {
	const titleField = fields.find(
		( field ) => field.id === view?.titleField
	);
	const mediaField = fields.find(
		( field ) => field.id === view?.mediaField
	);
	const descriptionField = fields.find(
		( field ) => field.id === view?.descriptionField
	);
	const otherFields = view.fields ?? [];
	const { regularFields, badgeFields } = otherFields.reduce(
		(
			accumulator: Record< string, NormalizedField< Item >[] >,
			fieldId
		) => {
			const field = fields.find( ( f ) => f.id === fieldId );
			if ( ! field ) {
				return accumulator;
			}
			// If the field is a badge field, add it to the badgeFields array
			// otherwise add it to the rest visibleFields array.
			const key = view.layout?.badgeFields?.includes( fieldId )
				? 'badgeFields'
				: 'regularFields';
			accumulator[ key ].push( field );
			return accumulator;
		},
		{ regularFields: [], badgeFields: [] }
	);
	const hasData = !! data?.length;
	const updatedPreviewSize = useUpdatedPreviewSizeOnViewportChange();
	const hasBulkActions = useSomeItemHasAPossibleBulkAction( actions, data );
	const usedPreviewSize = updatedPreviewSize || view.layout?.previewSize;
	const gridStyle = usedPreviewSize
		? {
				gridTemplateColumns: `repeat(${ usedPreviewSize }, minmax(0, 1fr))`,
		  }
		: {};

	const groupField = view.groupByField
		? fields.find( ( f ) => f.id === view.groupByField )
		: null;

	// Group data by groupByField if specified
	const dataByGroup = groupField
		? data.reduce( ( groups: Map< string, typeof data >, item ) => {
				const groupName = groupField.getValue( { item } );
				if ( ! groups.has( groupName ) ) {
					groups.set( groupName, [] );
				}
				groups.get( groupName )?.push( item );
				return groups;
		  }, new Map< string, typeof data >() )
		: null;

	return (
		<>
			{
				// Render multiple groups.
				hasData && groupField && dataByGroup && (
					<VStack spacing={ 4 }>
						{ Array.from( dataByGroup.entries() ).map(
							( [ groupName, groupItems ] ) => (
								<VStack key={ groupName } spacing={ 2 }>
									<h3 className="dataviews-view-grid__group-header">
										{ sprintf(
											// translators: 1: The label of the field e.g. "Date". 2: The value of the field, e.g.: "May 2022".
											__( '%1$s: %2$s' ),
											groupField.label,
											groupName
										) }
									</h3>
									<Grid
										gap={ 8 }
										columns={ 2 }
										alignment="top"
										className={ clsx(
											'dataviews-view-grid',
											className
										) }
										style={ gridStyle }
										aria-busy={ isLoading }
									>
										{ groupItems.map( ( item ) => {
											return (
												<GridItem
													key={ getItemId( item ) }
													view={ view }
													selection={ selection }
													onChangeSelection={
														onChangeSelection
													}
													onClickItem={ onClickItem }
													isItemClickable={
														isItemClickable
													}
													renderItemLink={
														renderItemLink
													}
													getItemId={ getItemId }
													item={ item }
													actions={ actions }
													mediaField={ mediaField }
													titleField={ titleField }
													descriptionField={
														descriptionField
													}
													regularFields={
														regularFields
													}
													badgeFields={ badgeFields }
													hasBulkActions={
														hasBulkActions
													}
												/>
											);
										} ) }
									</Grid>
								</VStack>
							)
						) }
					</VStack>
				)
			}

			{
				// Render a single grid with all data.
				hasData && ! dataByGroup && (
					<Grid
						gap={ 8 }
						columns={ 2 }
						alignment="top"
						className={ clsx( 'dataviews-view-grid', className ) }
						style={ gridStyle }
						aria-busy={ isLoading }
					>
						{ data.map( ( item ) => {
							return (
								<GridItem
									key={ getItemId( item ) }
									view={ view }
									selection={ selection }
									onChangeSelection={ onChangeSelection }
									onClickItem={ onClickItem }
									isItemClickable={ isItemClickable }
									renderItemLink={ renderItemLink }
									getItemId={ getItemId }
									item={ item }
									actions={ actions }
									mediaField={ mediaField }
									titleField={ titleField }
									descriptionField={ descriptionField }
									regularFields={ regularFields }
									badgeFields={ badgeFields }
									hasBulkActions={ hasBulkActions }
								/>
							);
						} ) }
					</Grid>
				)
			}
			{
				// Render empty state.
				! hasData && (
					<div
						className={ clsx( {
							'dataviews-loading': isLoading,
							'dataviews-no-results': ! isLoading,
						} ) }
					>
						<p>{ isLoading ? <Spinner /> : __( 'No results' ) }</p>
					</div>
				)
			}
		</>
	);
}

export default ViewGrid;
