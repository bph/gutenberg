/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SidebarNavigationScreen from '../sidebar-navigation-screen';
import { StyleBookPreview } from '../style-book';

export const stylebookRoute = {
	name: 'stylebook',
	path: '/stylebook',
	areas: {
		sidebar: (
			<SidebarNavigationScreen
				title={ __( 'Styles' ) }
				backPath="/"
				description={ __(
					`Preview your website's visual identity: colors, typography, and blocks.`
				) }
			/>
		),
		preview: <StyleBookPreview isStatic />,
		mobile: <StyleBookPreview isStatic />,
	},
};
