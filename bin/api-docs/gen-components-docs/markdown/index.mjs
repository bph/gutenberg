/**
 * External dependencies
 */
import json2md from 'json2md';

/**
 * Internal dependencies
 */
import { generateMarkdownPropsJson } from './props.mjs';

/**
 * If the string is contentful, ensure that it ends with a single newline.
 * Otherwise normalize to `undefined`.
 *
 * @param {string} [str]
 */
function normalizeTrailingNewline( str ) {
	if ( ! str?.trim() ) {
		return undefined;
	}
	return str.replace( /\n*$/, '\n' );
}

export function generateMarkdownDocs( { typeDocs, subcomponentTypeDocs } ) {
	const mainDocsJson = [
		{ h1: typeDocs.displayName },
		'<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->',
		{
			p: `<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-${ typeDocs.displayName.toLowerCase() }--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>`,
		},
		normalizeTrailingNewline( typeDocs.description ),
		...generateMarkdownPropsJson( typeDocs.props ),
	];

	const subcomponentDocsJson = subcomponentTypeDocs?.length
		? [
				{ h2: 'Subcomponents' },
				...subcomponentTypeDocs.flatMap( ( subcomponentTypeDoc ) => [
					{
						h3: subcomponentTypeDoc.displayName,
					},
					normalizeTrailingNewline( subcomponentTypeDoc.description ),
					...generateMarkdownPropsJson( subcomponentTypeDoc.props, {
						headingLevel: 4,
					} ),
				] ),
		  ]
		: [];

	return json2md(
		[ ...mainDocsJson, ...subcomponentDocsJson ].filter( Boolean )
	);
}
