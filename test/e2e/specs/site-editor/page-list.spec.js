/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Page List', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		// Activate a theme with permissions to access the site editor.
		await requestUtils.activateTheme( 'emptytheme' );
		await requestUtils.createPage( {
			title: 'Privacy Policy',
			status: 'publish',
		} );
		await requestUtils.createPage( {
			title: 'Sample Page',
			status: 'publish',
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		// Go back to the default theme.
		await Promise.all( [
			requestUtils.activateTheme( 'twentytwentyone' ),
			requestUtils.deleteAllPages(),
		] );
	} );

	test.beforeEach( async ( { admin, page } ) => {
		// Go to the pages page, as it has the list layout enabled by default.
		await admin.visitSiteEditor();
		await page.getByRole( 'button', { name: 'Pages' } ).click();
	} );

	test( 'Persists filter/search when switching layout', async ( {
		page,
	} ) => {
		// Search pages
		await page
			.getByRole( 'searchbox', { name: 'Search' } )
			.fill( 'Privacy' );

		// Switch layout
		await page.getByRole( 'button', { name: 'Layout' } ).click();
		await page.getByRole( 'menuitemradio', { name: 'Table' } ).click();

		// Confirm the table is visible
		await expect( page.getByRole( 'table' ) ).toContainText(
			'Privacy Policy'
		);

		// The search should still contain the search term
		await expect(
			page.getByRole( 'searchbox', { name: 'Search' } )
		).toHaveValue( 'Privacy' );
	} );
} );
