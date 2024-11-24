/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { humanTimeDiff } from '@wordpress/date';
import { createInterpolateElement } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import {
	Icon,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';
import { backup } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	SidebarNavigationScreenDetailsPanelRow,
	SidebarNavigationScreenDetailsPanelLabel,
	SidebarNavigationScreenDetailsPanelValue,
} from '../sidebar-navigation-screen-details-panel';
import SidebarNavigationItem from '../sidebar-navigation-item';

export default function SidebarNavigationScreenDetailsFooter( {
	record,
	revisionsCount,
	...otherProps
} ) {
	/*
	 * There might be other items in the future,
	 * but for now it's just modified date.
	 * Later we might render a list of items and isolate
	 * the following logic.
	 */
	const hrefProps = {};
	const lastRevisionId =
		record?._links?.[ 'predecessor-version' ]?.[ 0 ]?.id ?? null;

	// Use incoming prop first, then the record's version history, if available.
	revisionsCount =
		revisionsCount ||
		record?._links?.[ 'version-history' ]?.[ 0 ]?.count ||
		0;

	/*
	 * Enable the revisions link if there is a last revision and there is more than one revision.
	 * This link is used for theme assets, e.g., templates, which have no database record until they're edited.
	 * For these files there's only a "revision" after they're edited twice,
	 * which means the revision.php page won't display a proper diff.
	 * See: https://github.com/WordPress/gutenberg/issues/49164.
	 */
	if ( lastRevisionId && revisionsCount > 1 ) {
		hrefProps.href = addQueryArgs( 'revision.php', {
			revision: record?._links[ 'predecessor-version' ][ 0 ].id,
		} );
		hrefProps.as = 'a';
	}
	return (
		<ItemGroup className="edit-site-sidebar-navigation-screen-details-footer">
			<SidebarNavigationItem
				aria-label={ __( 'Revisions' ) }
				{ ...hrefProps }
				{ ...otherProps }
			>
				<SidebarNavigationScreenDetailsPanelRow justify="space-between">
					<SidebarNavigationScreenDetailsPanelLabel>
						{ __( 'Last modified' ) }
					</SidebarNavigationScreenDetailsPanelLabel>
					<SidebarNavigationScreenDetailsPanelValue>
						{ createInterpolateElement(
							sprintf(
								/* translators: %s: is the relative time when the post was last modified. */
								__( '<time>%s</time>' ),
								humanTimeDiff( record.modified )
							),
							{
								time: <time dateTime={ record.modified } />,
							}
						) }
					</SidebarNavigationScreenDetailsPanelValue>
					<Icon
						className="edit-site-sidebar-navigation-screen-details-footer__icon"
						icon={ backup }
					/>
				</SidebarNavigationScreenDetailsPanelRow>
			</SidebarNavigationItem>
		</ItemGroup>
	);
}
