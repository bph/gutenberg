<?php
/**
 * HTML for testing the iAPI's script module assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; ?>>
	<!-- A name is appended here every time a module is executed. -->
	<p data-testid="names" data-wp-text="state.names"></p>

	<!-- Links to pages with different blocks combination. -->
	<nav data-wp-interactive="test/router-script-modules">
		<?php if ( isset( $attributes['links'] ) ) : ?>
			<?php foreach ( $attributes['links'] as $label => $link ) : ?>
				<a
					data-testid="link <?php echo $label; ?>"
					data-wp-on--click="actions.navigate"
					data-wp-on-async--mouseenter="actions.prefetch"
					href="<?php echo $link; ?>"
				>
					<?php echo $label; ?>
				</a>
			<?php endforeach; ?>
		<?php endif; ?>
	</nav>

	<!-- HTML updated on navigation. -->
	<div
		data-wp-interactive="test/router-script-modules"
		data-wp-router-region="router-script-modules"
	>
		<?php echo $content; ?>
	</div>

	<!-- Text to check whether a navigation was client-side. -->
	<div
		data-testid="client-side navigation"
		data-wp-interactive="test/router-script-modules"
		data-wp-bind--hidden="!state.clientSideNavigation"
		hidden
	>
		Client-side navigation
	</div>
</div>
