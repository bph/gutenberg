/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Homepage Settings via Editor', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await Promise.all( [ requestUtils.activateTheme( 'emptytheme' ) ] );
		await requestUtils.createPage( {
			title: 'Homepage',
			status: 'publish',
		} );
	} );

	test.beforeEach( async ( { admin, page } ) => {
		await admin.visitSiteEditor();
		await page.getByRole( 'button', { name: 'Pages' } ).click();
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await Promise.all( [
			requestUtils.deleteAllPages(),
			requestUtils.updateSiteSettings( {
				show_on_front: 'posts',
				page_on_front: 0,
				page_for_posts: 0,
			} ),
		] );
	} );

	test( 'should show "Set as homepage" action on pages with `publish` status', async ( {
		page,
	} ) => {
		const samplePage = page
			.getByRole( 'gridcell' )
			.getByLabel( 'Homepage' );
		const samplePageRow = page
			.getByRole( 'row' )
			.filter( { has: samplePage } );
		await samplePageRow.hover();
		await samplePageRow
			.getByRole( 'button', {
				name: 'Actions',
			} )
			.click();
		await expect(
			page.getByRole( 'menuitem', { name: 'Set as homepage' } )
		).toBeVisible();
	} );

	test( 'should not show "Set as homepage" action on current homepage', async ( {
		page,
	} ) => {
		const samplePage = page
			.getByRole( 'gridcell' )
			.getByLabel( 'Homepage' );
		const samplePageRow = page
			.getByRole( 'row' )
			.filter( { has: samplePage } );
		await samplePageRow.click();
		await samplePageRow
			.getByRole( 'button', {
				name: 'Actions',
			} )
			.click();
		await page.getByRole( 'menuitem', { name: 'Set as homepage' } ).click();
		await page.getByRole( 'button', { name: 'Set homepage' } ).click();
		await expect(
			page.getByRole( 'menuitem', { name: 'Set as homepage' } )
		).toBeHidden();
	} );
} );
