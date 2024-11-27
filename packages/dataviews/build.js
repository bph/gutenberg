/**
 * External dependencies
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const esbuild = require( 'esbuild' );

const wpExternals = {
	name: 'wordpress-externals',
	setup( build ) {
		build.onResolve( { filter: /^@wordpress\// }, () => {
			// Bundle wordpress packages
			return { external: false };
		} );
		build.onResolve( { filter: /^\.[\.\/]/ }, () => {
			// Bundle relative paths
			return { external: false };
		} );
		build.onResolve( { filter: /.+/ }, ( args ) => {
			// Mark everything else as external
			return { path: args.path, external: true };
		} );
	},
};

esbuild.build( {
	entryPoints: [ 'src/index.ts' ],
	bundle: true,
	outdir: 'build-wp',
	plugins: [ wpExternals ],
	jsx: 'automatic',
	logLevel: 'info',
	format: 'esm',
} );
