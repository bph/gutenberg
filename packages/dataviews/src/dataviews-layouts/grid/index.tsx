/**
 * External dependencies
 */
import clsx from 'clsx';

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
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ItemActions from '../../components/dataviews-item-actions';
import DataViewsSelectionCheckbox from '../../components/dataviews-selection-checkbox';
import { useHasAPossibleBulkAction } from '../../components/dataviews-bulk-actions';
import type {
	Action,
	NormalizedField,
	ViewGrid as ViewGridType,
	ViewGridProps,
} from '../../types';
import type { SetSelection } from '../../private-types';
import getClickableItemProps from '../utils/get-clickable-item-props';
import { useUpdatedPreviewSizeOnViewportChange } from './preview-size-picker';

interface GridItemProps< Item > {
	view: ViewGridType;
	selection: string[];
	onChangeSelection: SetSelection;
	getItemId: ( item: Item ) => string;
	onClickItem?: ( item: Item ) => void;
	isItemClickable: ( item: Item ) => boolean;
	item: Item;
	actions: Action< Item >[];
	titleField?: NormalizedField< Item >;
	mediaField?: NormalizedField< Item >;
	descriptionField?: NormalizedField< Item >;
	regularFields: NormalizedField< Item >[];
	badgeFields: NormalizedField< Item >[];
}

function GridItem< Item >( {
	view,
	selection,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	getItemId,
	item,
	actions,
	mediaField,
	titleField,
	descriptionField,
	regularFields,
	badgeFields,
}: GridItemProps< Item > ) {
	const { showTitle = true, showMedia = true, showDescription = true } = view;
	const hasBulkAction = useHasAPossibleBulkAction( actions, item );
	const id = getItemId( item );
	const isSelected = selection.includes( id );
	const renderedMediaField = mediaField?.render ? (
		<mediaField.render item={ item } />
	) : null;
	const renderedTitleField =
		showTitle && titleField?.render ? (
			<titleField.render item={ item } />
		) : null;

	const clickableMediaItemProps = getClickableItemProps( {
		item,
		isItemClickable,
		onClickItem,
		className: 'dataviews-view-grid__media',
	} );

	const clickablePrimaryItemProps = getClickableItemProps( {
		item,
		isItemClickable,
		onClickItem,
		className: 'dataviews-view-grid__primary-field dataviews-title-field',
	} );

	return (
		<VStack
			spacing={ 0 }
			key={ id }
			className={ clsx( 'dataviews-view-grid__card', {
				'is-selected': hasBulkAction && isSelected,
			} ) }
			onClickCapture={ ( event ) => {
				if ( event.ctrlKey || event.metaKey ) {
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
				<div { ...clickableMediaItemProps }>{ renderedMediaField }</div>
			) }
			{ showMedia && renderedMediaField && (
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
				<div { ...clickablePrimaryItemProps }>
					{ renderedTitleField }
				</div>
				<ItemActions item={ item } actions={ actions } isCompact />
			</HStack>
			<VStack spacing={ 1 }>
				{ showDescription && descriptionField?.render && (
					<descriptionField.render item={ item } />
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
								<FlexItem
									key={ field.id }
									className="dataviews-view-grid__field-value"
								>
									<field.render item={ item } />
								</FlexItem>
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
											<field.render item={ item } />
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

export default function ViewGrid< Item >( {
	actions,
	data,
	fields,
	getItemId,
	isLoading,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	selection,
	view,
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
	const { regularFields, badgeFields } = fields.reduce(
		( accumulator: Record< string, NormalizedField< Item >[] >, field ) => {
			if (
				! otherFields.includes( field.id ) ||
				[
					view?.mediaField,
					view?.titleField,
					view?.descriptionField,
				].includes( field.id )
			) {
				return accumulator;
			}
			// If the field is a badge field, add it to the badgeFields array
			// otherwise add it to the rest visibleFields array.
			const key = view.layout?.badgeFields?.includes( field.id )
				? 'badgeFields'
				: 'regularFields';
			accumulator[ key ].push( field );
			return accumulator;
		},
		{ regularFields: [], badgeFields: [] }
	);
	const hasData = !! data?.length;
	const updatedPreviewSize = useUpdatedPreviewSizeOnViewportChange();
	const usedPreviewSize = updatedPreviewSize || view.layout?.previewSize;
	const gridStyle = usedPreviewSize
		? {
				gridTemplateColumns: `repeat(${ usedPreviewSize }, minmax(0, 1fr))`,
		  }
		: {};
	return (
		<>
			{ hasData && (
				<Grid
					gap={ 8 }
					columns={ 2 }
					alignment="top"
					className="dataviews-view-grid"
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
								getItemId={ getItemId }
								item={ item }
								actions={ actions }
								mediaField={ mediaField }
								titleField={ titleField }
								descriptionField={ descriptionField }
								regularFields={ regularFields }
								badgeFields={ badgeFields }
							/>
						);
					} ) }
				</Grid>
			) }
			{ ! hasData && (
				<div
					className={ clsx( {
						'dataviews-loading': isLoading,
						'dataviews-no-results': ! isLoading,
					} ) }
				>
					<p>{ isLoading ? <Spinner /> : __( 'No results' ) }</p>
				</div>
			) }
		</>
	);
}
