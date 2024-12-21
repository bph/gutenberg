<?php
/**
 * HTML for testing the iAPI's style assets management.
 *
 * @package gutenberg-test-interactive-blocks
 *
 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
 */

$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; ?>>
	<!-- These get colored when the corresponding block is present. -->
	<fieldset>
		<legend>Styles from block styles</legend>
		<p data-testid="red" class="red">Red</p>
		<p data-testid="green" class="green">Green</p>
		<p data-testid="blue" class="blue">Blue</p>
		<p data-testid="all" class="red green blue">All</p>
	</fieldset>

	<!-- These get colored when the corresponding block enqueues a referenced stylesheet. -->
	<fieldset>
		<legend>Styles from referenced style sheets</legend>
		<p data-testid="red-from-link" class="red-from-link">Red from link</p>
		<p data-testid="green-from-link" class="green-from-link">Green from link</p>
		<p data-testid="blue-from-link" class="blue-from-link">Blue from link</p>
		<p data-testid="all-from-link" class="red-from-link green-from-link blue-from-link">All from link</p>
		<div data-testid="background-from-link"class="background-from-link" style="width: 10px; height: 10px"></div>
	</fieldset>

	<!-- These get colored when the corresponding block adds inline style. -->
	<fieldset>
		<legend>Styles from inline styles</legend>
		<p data-testid="red-from-inline" class="red-from-inline">Red</p>
		<p data-testid="green-from-inline" class="green-from-inline">Green</p>
		<p data-testid="blue-from-inline" class="blue-from-inline">Blue</p>
		<p data-testid="all-from-inline" class="red-from-inline green-from-inline blue-from-inline">All</p>
	</fieldset>

	<!-- Links to pages with different blocks combination. -->
	<nav data-wp-interactive="test/router-styles">
		<?php foreach ( $attributes['links'] as $label => $link ) : ?>
			<a
				data-testid="link <?php echo $label; ?>"
				data-wp-on--click="actions.navigate"
				href="<?php echo $link; ?>"
			>
				<?php echo $label; ?>
			</a>
		<?php endforeach; ?>
	</nav>

	<!-- HTML updated on navigation. -->
	<div
		data-wp-interactive="test/router-styles"
		data-wp-router-region="router-styles"
	>
		<?php echo $content; ?>
	</div>

	<!-- Text to check whether a navigation was client-side. -->
	<div
		data-testid="client-side navigation"
		data-wp-interactive="test/router-styles"
		data-wp-bind--hidden="!state.clientSideNavigation"
	>
		Client-side navigation
	</div>
</div>
