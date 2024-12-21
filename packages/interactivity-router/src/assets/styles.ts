const cssUrlRegEx =
	/url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g;

const resolveUrl = ( relativeUrl: string, baseUrl: string ) => {
	try {
		return new URL( relativeUrl, baseUrl ).toString();
	} catch ( e ) {
		return relativeUrl;
	}
};

const withAbsoluteUrls = ( cssText: string, baseUrl: string ) =>
	cssText.replace(
		cssUrlRegEx,
		( _match, quotes = '', relUrl1, relUrl2 ) =>
			`url(${ quotes }${ resolveUrl(
				relUrl1 || relUrl2,
				baseUrl
			) }${ quotes })`
	);

const styleSheetCache = new Map< string, Promise< CSSStyleSheet > >();

const getCachedSheet = async (
	sheetId: string,
	factory: () => Promise< CSSStyleSheet >
) => {
	if ( ! styleSheetCache.has( sheetId ) ) {
		styleSheetCache.set( sheetId, factory() );
	}
	return styleSheetCache.get( sheetId );
};

const sheetFromLink = async (
	{ id, href, sheet: elementSheet }: HTMLLinkElement,
	baseUrl: string
) => {
	const sheetId = id || href;
	const sheetUrl = resolveUrl( href, baseUrl );

	if ( elementSheet ) {
		return getCachedSheet( sheetId, () => {
			const sheet = new CSSStyleSheet();
			for ( const { cssText } of elementSheet.cssRules ) {
				sheet.insertRule( withAbsoluteUrls( cssText, sheetUrl ) );
			}
			return Promise.resolve( sheet );
		} );
	}
	return getCachedSheet( sheetId, async () => {
		const response = await fetch( href );
		const text = await response.text();
		const sheet = new CSSStyleSheet();
		await sheet.replace( withAbsoluteUrls( text, sheetUrl ) );
		return sheet;
	} );
};

const sheetFromStyle = async ( { textContent }: HTMLStyleElement ) => {
	const sheetId = textContent;
	return getCachedSheet( sheetId, async () => {
		const sheet = new CSSStyleSheet();
		await sheet.replace( textContent );
		return sheet;
	} );
};

export const generateCSSStyleSheets = (
	doc: Document,
	baseUrl: string = ( doc.location || window.location ).href
): Promise< CSSStyleSheet >[] =>
	[ ...doc.querySelectorAll( 'style,link[rel=stylesheet]' ) ].map(
		( element ) => {
			if ( 'LINK' === element.nodeName ) {
				return sheetFromLink( element as HTMLLinkElement, baseUrl );
			}
			return sheetFromStyle( element as HTMLStyleElement );
		}
	);
