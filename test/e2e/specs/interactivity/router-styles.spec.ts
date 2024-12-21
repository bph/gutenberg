/**
 * Internal dependencies
 */
import { test, expect } from './fixtures';

const COLOR_RED = 'rgb(255, 0, 0)';
const COLOR_GREEN = 'rgb(0, 255, 0)';
const COLOR_BLUE = 'rgb(0, 0, 255)';
const COLOR_WRAPPER = 'rgb(160, 12, 60)';

test.describe( 'Router styles', () => {
	test.beforeAll( async ( { interactivityUtils: utils } ) => {
		await utils.activatePlugins();
		const red = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'red',
				innerBlocks: [ [ 'test/router-styles-red' ] ],
			}
		);
		const green = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'green',
				innerBlocks: [ [ 'test/router-styles-green' ] ],
			}
		);
		const blue = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'blue',
				innerBlocks: [ [ 'test/router-styles-blue' ] ],
			}
		);

		const all = await utils.addPostWithBlock(
			'test/router-styles-wrapper',
			{
				alias: 'all',
				innerBlocks: [
					[ 'test/router-styles-red' ],
					[ 'test/router-styles-green' ],
					[ 'test/router-styles-blue' ],
				],
			}
		);

		await utils.addPostWithBlock( 'test/router-styles-wrapper', {
			alias: 'none',
			attributes: { links: { red, green, blue, all } },
		} );
	} );

	test.beforeEach( async ( { page, interactivityUtils: utils } ) => {
		await page.goto( utils.getLink( 'none' ) );
	} );

	test.afterAll( async ( { interactivityUtils: utils } ) => {
		await utils.deactivatePlugins();
		await utils.deleteAllPosts();
	} );

	test( 'should add and remove styles from style tags', async ( {
		page,
	} ) => {
		const csn = page.getByTestId( 'client-side navigation' );
		const red = page.getByTestId( 'red' );
		const green = page.getByTestId( 'green' );
		const blue = page.getByTestId( 'blue' );
		const all = page.getByTestId( 'all' );

		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_WRAPPER );

		await page.getByTestId( 'link red' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_RED );

		await page.getByTestId( 'link green' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_GREEN );

		await page.getByTestId( 'link blue' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );

		await page.getByTestId( 'link all' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );
	} );

	test( 'should add and remove styles from referenced style sheets', async ( {
		page,
	} ) => {
		const csn = page.getByTestId( 'client-side navigation' );
		const red = page.getByTestId( 'red-from-link' );
		const green = page.getByTestId( 'green-from-link' );
		const blue = page.getByTestId( 'blue-from-link' );
		const all = page.getByTestId( 'all-from-link' );

		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_WRAPPER );

		await page.getByTestId( 'link red' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_RED );

		await page.getByTestId( 'link green' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_GREEN );

		await page.getByTestId( 'link blue' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );

		await page.getByTestId( 'link all' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );
	} );

	test( 'should support relative URLs in referenced style sheets', async ( {
		page,
	} ) => {
		const csn = page.getByTestId( 'client-side navigation' );
		const background = page.getByTestId( 'background-from-link' );

		await expect( background ).toHaveScreenshot();

		await page.getByTestId( 'link red' ).click();

		await expect( csn ).toBeVisible();
		await expect( background ).toHaveScreenshot();

		await page.getByTestId( 'link green' ).click();

		await expect( csn ).toBeVisible();
		await expect( background ).toHaveScreenshot();

		await page.getByTestId( 'link blue' ).click();

		await expect( csn ).toBeVisible();
		await expect( background ).toHaveScreenshot();

		await page.getByTestId( 'link all' ).click();

		await expect( csn ).toBeVisible();
		await expect( background ).toHaveScreenshot();
	} );

	test( 'should update style tags with modified content', async ( {
		page,
	} ) => {
		const csn = page.getByTestId( 'client-side navigation' );
		const red = page.getByTestId( 'red-from-inline' );
		const green = page.getByTestId( 'green-from-inline' );
		const blue = page.getByTestId( 'blue-from-inline' );
		const all = page.getByTestId( 'all-from-inline' );

		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_WRAPPER );

		await page.getByTestId( 'link red' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_RED );

		await page.getByTestId( 'link green' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( all ).toHaveCSS( 'color', COLOR_GREEN );

		await page.getByTestId( 'link blue' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( green ).toHaveCSS( 'color', COLOR_WRAPPER );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );

		await page.getByTestId( 'link all' ).click();

		await expect( csn ).toBeVisible();
		await expect( red ).toHaveCSS( 'color', COLOR_RED );
		await expect( green ).toHaveCSS( 'color', COLOR_GREEN );
		await expect( blue ).toHaveCSS( 'color', COLOR_BLUE );
		await expect( all ).toHaveCSS( 'color', COLOR_BLUE );
	} );
} );
