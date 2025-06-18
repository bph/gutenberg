<?php
/**
 * HTML for testing the iAPI's script module assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$module_path = '/module.js';
$module_url  = plugins_url( $module_path, __FILE__ );
wp_register_script_module(
	'test/router-script-modules-bravo',
	$module_url,
	array(),
	filemtime( plugin_dir_path( __FILE__ ) . $module_path )
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'data-testid'         => 'bravo-block',
		'data-wp-interactive' => 'test/router-script-modules-bravo',
		'data-wp-text'        => 'state.name',
	)
);
?>
<p <?php echo $wrapper_attributes; ?>></p>
