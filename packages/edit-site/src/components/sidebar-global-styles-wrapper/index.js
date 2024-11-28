/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useViewportMatch } from '@wordpress/compose';
import {
	Button,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import GlobalStylesUI from '../global-styles/ui';
import Page from '../page';
import { unlock } from '../../lock-unlock';
import StyleBook from '../style-book';
import { STYLE_BOOK_COLOR_GROUPS } from '../style-book/constants';

const { useLocation, useHistory } = unlock( routerPrivateApis );
const { Menu } = unlock( componentsPrivateApis );

const GlobalStylesPageActions = ( {
	isStyleBookOpened,
	setIsStyleBookOpened,
} ) => {
	return (
		<Menu
			trigger={
				<Button __next40pxDefaultSize variant="tertiary" size="compact">
					{ __( 'Preview' ) }
				</Button>
			}
		>
			<Menu.RadioItem
				value
				checked={ isStyleBookOpened }
				name="styles-preview-actions"
				onChange={ () => setIsStyleBookOpened( true ) }
				defaultChecked
			>
				<Menu.ItemLabel>{ __( 'Style book' ) }</Menu.ItemLabel>
				<Menu.ItemHelpText>
					{ __( 'Preview blocks and styles.' ) }
				</Menu.ItemHelpText>
			</Menu.RadioItem>
			<Menu.RadioItem
				value={ false }
				checked={ ! isStyleBookOpened }
				name="styles-preview-actions"
				onChange={ () => setIsStyleBookOpened( false ) }
			>
				<Menu.ItemLabel>{ __( 'Site' ) }</Menu.ItemLabel>
				<Menu.ItemHelpText>
					{ __( 'Preview your site.' ) }
				</Menu.ItemHelpText>
			</Menu.RadioItem>
		</Menu>
	);
};

export default function GlobalStylesUIWrapper() {
	const { path, query } = useLocation();
	const history = useHistory();
	const { canvas = 'view' } = query;
	const [ isStyleBookOpened, setIsStyleBookOpened ] = useState( false );
	const isMobileViewport = useViewportMatch( 'medium', '<' );
	const [ section, onChangeSection ] = useMemo( () => {
		return [
			query.section ?? '/',
			( updatedSection ) => {
				history.navigate(
					addQueryArgs( path, {
						section: updatedSection,
					} )
				);
			},
		];
	}, [ path, query.section, history ] );

	return (
		<>
			<Page
				actions={
					! isMobileViewport ? (
						<GlobalStylesPageActions
							isStyleBookOpened={ isStyleBookOpened }
							setIsStyleBookOpened={ setIsStyleBookOpened }
						/>
					) : null
				}
				className="edit-site-styles"
				title={ __( 'Styles' ) }
			>
				<GlobalStylesUI
					path={ section }
					onPathChange={ onChangeSection }
				/>
			</Page>
			{ canvas === 'view' && isStyleBookOpened && (
				<StyleBook
					enableResizing={ false }
					showCloseButton={ false }
					showTabs={ false }
					isSelected={ ( blockName ) =>
						// Match '/blocks/core%2Fbutton' and
						// '/blocks/core%2Fbutton/typography', but not
						// '/blocks/core%2Fbuttons'.
						section ===
							`/blocks/${ encodeURIComponent( blockName ) }` ||
						section.startsWith(
							`/blocks/${ encodeURIComponent( blockName ) }/`
						)
					}
					path={ section }
					onSelect={ ( blockName ) => {
						if (
							STYLE_BOOK_COLOR_GROUPS.find(
								( group ) => group.slug === blockName
							)
						) {
							// Go to color palettes Global Styles.
							onChangeSection( '/colors/palette' );
							return;
						}
						if ( blockName === 'typography' ) {
							// Go to typography Global Styles.
							onChangeSection( '/typography' );
							return;
						}

						// Now go to the selected block.
						onChangeSection(
							`/blocks/${ encodeURIComponent( blockName ) }`
						);
					} }
				/>
			) }
		</>
	);
}
