export default function getClickableItemProps< Item >(
	item: Item,
	isItemClickable: ( item: Item ) => boolean,
	onClickItem: ( item: Item ) => void,
	className: string
) {
	if ( ! isItemClickable( item ) ) {
		return { className };
	}

	return {
		className: `${ className } ${ className }--clickable`,
		role: 'button',
		tabIndex: 0,
		onClick: ( event: React.MouseEvent ) => {
			// Prevents onChangeSelection from triggering.
			event.stopPropagation();
			onClickItem( item );
		},
		onKeyDown: ( event: React.KeyboardEvent ) => {
			if ( event.key === 'Enter' || event.key === '' ) {
				// Prevents onChangeSelection from triggering.
				event.stopPropagation();
				onClickItem( item );
			}
		},
	};
}
