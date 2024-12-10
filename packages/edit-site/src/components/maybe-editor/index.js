/**
 * WordPress dependencies
 */

import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import Editor from '../editor';

export function MaybeEditor( { showEditor = true } ) {
	const { isBlockBasedTheme, siteUrl } = useSelect( ( select ) => {
		const { getEntityRecord, getCurrentTheme } = select( coreStore );
		const siteData = getEntityRecord( 'root', '__unstableBase' );

		return {
			isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
			siteUrl: siteData?.home,
		};
	}, [] );

	// If theme is block based, return the Editor, otherwise return the site preview.
	return isBlockBasedTheme || showEditor ? (
		<Editor />
	) : (
		<iframe
			src={ siteUrl }
			title={ __( 'Site Preview' ) }
			style={ {
				display: 'block',
				width: '100%',
				height: '100%',
				backgroundColor: '#fff',
			} }
			onLoad={ ( event ) => {
				// Hide the admin bar in the front-end preview.
				const document = event.target.contentDocument;
				document.getElementById( 'wpadminbar' ).remove();
				document
					.getElementsByTagName( 'html' )[ 0 ]
					.setAttribute( 'style', 'margin-top: 0 !important;' );
				// Make interactive elements unclickable.
				const interactiveElements = document.querySelectorAll(
					'a, button, input, details, audio'
				);
				interactiveElements.forEach( ( element ) => {
					element.style.pointerEvents = 'none';
					element.tabIndex = -1;
					element.setAttribute( 'aria-hidden', 'true' );
				} );
			} }
		/>
	);
}
