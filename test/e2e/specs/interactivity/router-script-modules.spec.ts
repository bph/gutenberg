/**
 * Internal dependencies
 */
import { test, expect } from './fixtures';

test.describe( 'Router script modules', () => {
	test.beforeAll( async ( { interactivityUtils: utils } ) => {
		await utils.activatePlugins();
		const alpha = await utils.addPostWithBlock(
			'test/router-script-modules-wrapper',
			{
				alias: 'alpha',
				innerBlocks: [ [ 'test/router-script-modules-alpha' ] ],
			}
		);
		const bravo = await utils.addPostWithBlock(
			'test/router-script-modules-wrapper',
			{
				alias: 'bravo',
				innerBlocks: [ [ 'test/router-script-modules-bravo' ] ],
			}
		);
		const charlie = await utils.addPostWithBlock(
			'test/router-script-modules-wrapper',
			{
				alias: 'charlie',
				innerBlocks: [ [ 'test/router-script-modules-charlie' ] ],
			}
		);

		const all = await utils.addPostWithBlock(
			'test/router-script-modules-wrapper',
			{
				alias: 'all',
				innerBlocks: [
					[ 'test/router-script-modules-alpha' ],
					[ 'test/router-script-modules-bravo' ],
					[ 'test/router-script-modules-charlie' ],
				],
			}
		);

		await utils.addPostWithBlock( 'test/router-script-modules-wrapper', {
			alias: 'none',
			attributes: { links: { alpha, bravo, charlie, all } },
		} );
	} );

	test.beforeEach( async ( { page, interactivityUtils: utils } ) => {
		await page.goto( utils.getLink( 'none' ) );
	} );

	test.afterAll( async ( { interactivityUtils: utils } ) => {
		await utils.deactivatePlugins();
		await utils.deleteAllPosts();
	} );

	test( 'should handle modules from new blocks', async ( { page } ) => {
		const requestedModules = [];

		await page.route( '**/*.js*', async ( route ) => {
			requestedModules.push( route.request().url() );
			await route.continue();
		} );

		const csn = page.getByTestId( 'client-side navigation' );
		const alpha = page.getByTestId( 'alpha-block' );
		const bravo = page.getByTestId( 'bravo-block' );
		const charlie = page.getByTestId( 'charlie-block' );

		await page.getByTestId( 'link alpha' ).click();

		// This element disappears when a navigation starts.
		// It should be visible again after a successful navigation.
		await expect( csn ).toBeHidden();
		await expect( csn ).toBeVisible();

		// Check the page title to ensure navigation was successful.
		await expect( page ).toHaveTitle( 'alpha – gutenberg' );

		await expect( alpha ).toBeVisible();
		await expect( bravo ).toBeHidden();
		await expect( charlie ).toBeHidden();

		await page.getByTestId( 'link bravo' ).click();

		await expect( csn ).toBeHidden();
		await expect( csn ).toBeVisible();
		await expect( page ).toHaveTitle( 'bravo – gutenberg' );

		await expect( alpha ).toBeHidden();
		await expect( bravo ).toBeVisible();
		await expect( charlie ).toBeHidden();

		await page.getByTestId( 'link charlie' ).click();

		await expect( csn ).toBeHidden();
		await expect( csn ).toBeVisible();
		await expect( page ).toHaveTitle( 'charlie – gutenberg' );

		await expect( alpha ).toBeHidden();
		await expect( bravo ).toBeHidden();
		await expect( charlie ).toBeVisible();

		await page.getByTestId( 'link all' ).click();

		await expect( csn ).toBeHidden();
		await expect( csn ).toBeVisible();
		await expect( page ).toHaveTitle( 'all – gutenberg' );

		await expect( alpha ).toBeVisible();
		await expect( bravo ).toBeVisible();
		await expect( charlie ).toBeVisible();
	} );
} );
