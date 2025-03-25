/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Template hierarchy', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyfour' );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test( 'shows correct template with page on front option', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.visitAdminPage( 'options-reading.php' );
		await page.click( 'input[name="show_on_front"][value="page"]' );
		await page.selectOption( 'select[name="page_on_front"]', '2' );
		await page.click( 'input[type="submit"]' );
		await admin.visitSiteEditor();
		await editor.canvas.locator( 'body' ).click();

		// The document bar should contain "Sample Page".
		await expect(
			page
				.getByRole( 'region', { name: 'Editor top bar' } )
				.getByRole( 'button', { name: 'Sample Page · Homepage' } )
		).toBeVisible();

		await admin.visitAdminPage( 'options-reading.php' );
		await page.click( 'input[name="show_on_front"][value="posts"]' );
		await page.click( 'input[type="submit"]' );
	} );
} );
