<?php

/**
 * Test the border block supports.
 *
 * @package Gutenberg
 */

class WP_Block_Supports_Border_Test extends WP_UnitTestCase {
	/**
	 * @var string|null
	 */
	private $test_block_name;

	public function set_up() {
		parent::set_up();
		$this->test_block_name = null;
	}

	public function tear_down() {
		unregister_block_type( $this->test_block_name );
		$this->test_block_name = null;
		parent::tear_down();
	}

	/**
	 * Registers a new block for testing border support.
	 *
	 * @param string $block_name Name for the test block.
	 * @param array  $supports   Array defining block support configuration.
	 *
	 * @return WP_Block_Type The block type for the newly registered test block.
	 */
	private function register_bordered_block_with_support( $block_name, $supports = array() ) {
		$this->test_block_name = $block_name;
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 3,
				'attributes'  => array(
					'borderColor' => array(
						'type' => 'string',
					),
					'style'       => array(
						'type' => 'object',
					),
				),
				'supports'    => $supports,
			)
		);
		$registry = WP_Block_Type_Registry::get_instance();

		return $registry->get_registered( $this->test_block_name );
	}

	public function test_border_object_with_no_styles() {
		$block_type  = self::register_bordered_block_with_support(
			'test/border-object-with-no-styles',
			array(
				'__experimentalBorder' => array(
					'color'  => true,
					'radius' => true,
					'width'  => true,
					'style'  => true,
				),
			)
		);
		$block_attrs = array( 'style' => array( 'border' => array() ) );
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array();

		$this->assertSame( $expected, $actual );
	}

	public function test_border_object_with_invalid_style_prop() {
		$block_type  = self::register_bordered_block_with_support(
			'test/border-object-with-invalid-style-prop',
			array(
				'__experimentalBorder' => array(
					'color'  => true,
					'radius' => true,
					'width'  => true,
					'style'  => true,
				),
			)
		);
		$block_attrs = array( 'style' => array( 'border' => array( 'invalid' => '10px' ) ) );
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array();

		$this->assertSame( $expected, $actual );
	}

	public function test_border_color_slug_with_numbers_is_kebab_cased_properly() {
		$block_type = self::register_bordered_block_with_support(
			'test/border-color-slug-with-numbers-is-kebab-cased-properly',
			array(
				'__experimentalBorder' => array(
					'color'  => true,
					'radius' => true,
					'width'  => true,
					'style'  => true,
				),
			)
		);
		$block_atts = array(
			'borderColor' => 'red',
			'style'       => array(
				'border' => array(
					'radius' => '10px',
					'width'  => '1px',
					'style'  => 'dashed',
				),
			),
		);

		$actual   = gutenberg_apply_border_support( $block_type, $block_atts );
		$expected = array(
			'class' => 'has-border-color has-red-border-color',
			'style' => 'border-radius:10px;border-style:dashed;border-width:1px;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_flat_border_with_skipped_serialization() {
		$block_type = self::register_bordered_block_with_support(
			'test/flat-border-with-skipped-serialization',
			array(
				'__experimentalBorder' => array(
					'color'             => true,
					'radius'            => true,
					'width'             => true,
					'style'             => true,
					'skipSerialization' => true,
				),
			)
		);
		$block_atts = array(
			'style' => array(
				'border' => array(
					'color'  => '#eeeeee',
					'width'  => '1px',
					'style'  => 'dotted',
					'radius' => '10px',
				),
			),
		);

		$actual   = gutenberg_apply_border_support( $block_type, $block_atts );
		$expected = array();

		$this->assertSame( $expected, $actual );
	}

	public function test_flat_border_with_individual_skipped_serialization() {
		$block_type = self::register_bordered_block_with_support(
			'test/flat-border-with-individual-skipped-serialization',
			array(
				'__experimentalBorder' => array(
					'color'                           => true,
					'radius'                          => true,
					'width'                           => true,
					'style'                           => true,
					'__experimentalSkipSerialization' => array( 'radius', 'color' ),
				),
			)
		);
		$block_atts = array(
			'style' => array(
				'border' => array(
					'color'  => '#eeeeee',
					'width'  => '1px',
					'style'  => 'dotted',
					'radius' => '10px',
				),
			),
		);

		$actual   = gutenberg_apply_border_support( $block_type, $block_atts );
		$expected = array(
			'style' => 'border-style:dotted;border-width:1px;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_split_border_radius() {
		$block_type  = self::register_bordered_block_with_support(
			'test/split-border-radius',
			array(
				'__experimentalBorder' => array(
					'radius' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'radius' => array(
						'topLeft'     => '1em',
						'topRight'    => '2rem',
						'bottomLeft'  => '30px',
						'bottomRight' => '4vh',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'style' => 'border-top-left-radius:1em;border-top-right-radius:2rem;border-bottom-left-radius:30px;border-bottom-right-radius:4vh;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_flat_border_with_custom_color() {
		$block_type  = self::register_bordered_block_with_support(
			'test/flat-border-with-custom-color',
			array(
				'__experimentalBorder' => array(
					'color' => true,
					'width' => true,
					'style' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'color' => '#72aee6',
					'width' => '2px',
					'style' => 'dashed',
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'class' => 'has-border-color',
			'style' => 'border-color:#72aee6;border-style:dashed;border-width:2px;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_split_borders_with_custom_colors() {
		$block_type  = self::register_bordered_block_with_support(
			'test/split-borders-with-custom-colors',
			array(
				'__experimentalBorder' => array(
					'color' => true,
					'width' => true,
					'style' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'top'    => array(
						'color' => '#72aee6',
						'width' => '2px',
						'style' => 'dashed',
					),
					'right'  => array(
						'color' => '#e65054',
						'width' => '0.25rem',
						'style' => 'dotted',
					),
					'bottom' => array(
						'color' => '#007017',
						'width' => '0.5em',
						'style' => 'solid',
					),
					'left'   => array(
						'color' => '#f6f7f7',
						'width' => '1px',
						'style' => 'solid',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'style' => 'border-top-width:2px;border-top-color:#72aee6;border-top-style:dashed;border-right-width:0.25rem;border-right-color:#e65054;border-right-style:dotted;border-bottom-width:0.5em;border-bottom-color:#007017;border-bottom-style:solid;border-left-width:1px;border-left-color:#f6f7f7;border-left-style:solid;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_split_borders_with_skipped_serialization() {
		$block_type  = self::register_bordered_block_with_support(
			'test/split-borders-with-skipped-serialization',
			array(
				'__experimentalBorder' => array(
					'color'                           => true,
					'width'                           => true,
					'style'                           => true,
					'__experimentalSkipSerialization' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'top'    => array(
						'color' => '#72aee6',
						'width' => '2px',
						'style' => 'dashed',
					),
					'right'  => array(
						'color' => '#e65054',
						'width' => '0.25rem',
						'style' => 'dotted',
					),
					'bottom' => array(
						'color' => '#007017',
						'width' => '0.5em',
						'style' => 'solid',
					),
					'left'   => array(
						'color' => '#f6f7f7',
						'width' => '1px',
						'style' => 'solid',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array();

		$this->assertSame( $expected, $actual );
	}

	public function test_split_borders_with_skipped_individual_feature_serialization() {
		$block_type  = self::register_bordered_block_with_support(
			'test/split-borders-with-skipped-individual-feature-serialization',
			array(
				'__experimentalBorder' => array(
					'color'                           => true,
					'width'                           => true,
					'style'                           => true,
					'__experimentalSkipSerialization' => array( 'width', 'style' ),
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'top'    => array(
						'color' => '#72aee6',
						'width' => '2px',
						'style' => 'dashed',
					),
					'right'  => array(
						'color' => '#e65054',
						'width' => '0.25rem',
						'style' => 'dotted',
					),
					'bottom' => array(
						'color' => '#007017',
						'width' => '0.5em',
						'style' => 'solid',
					),
					'left'   => array(
						'color' => '#f6f7f7',
						'width' => '1px',
						'style' => 'solid',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'style' => 'border-top-color:#72aee6;border-right-color:#e65054;border-bottom-color:#007017;border-left-color:#f6f7f7;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_partial_split_borders() {
		$block_type  = self::register_bordered_block_with_support(
			'test/partial-split-borders',
			array(
				'__experimentalBorder' => array(
					'color' => true,
					'width' => true,
					'style' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'top'   => array(
						'color' => '#72aee6',
						'width' => '2px',
						'style' => 'dashed',
					),
					'right' => array(
						'color' => '#e65054',
						'width' => '0.25rem',
					),
					'left'  => array(
						'style' => 'solid',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'style' => 'border-top-width:2px;border-top-color:#72aee6;border-top-style:dashed;border-right-width:0.25rem;border-right-color:#e65054;border-left-style:solid;',
		);

		$this->assertSame( $expected, $actual );
	}

	public function test_split_borders_with_named_colors() {
		$block_type  = self::register_bordered_block_with_support(
			'test/split-borders-with-named-colors',
			array(
				'__experimentalBorder' => array(
					'color' => true,
					'width' => true,
					'style' => true,
				),
			)
		);
		$block_attrs = array(
			'style' => array(
				'border' => array(
					'top'    => array(
						'width' => '2px',
						'style' => 'dashed',
						'color' => 'var:preset|color|red',
					),
					'right'  => array(
						'width' => '0.25rem',
						'style' => 'dotted',
						'color' => 'var:preset|color|green',
					),
					'bottom' => array(
						'width' => '0.5em',
						'style' => 'solid',
						'color' => 'var:preset|color|blue',
					),
					'left'   => array(
						'width' => '1px',
						'style' => 'solid',
						'color' => 'var:preset|color|yellow',
					),
				),
			),
		);
		$actual      = gutenberg_apply_border_support( $block_type, $block_attrs );
		$expected    = array(
			'style' => 'border-top-width:2px;border-top-color:var(--wp--preset--color--red);border-top-style:dashed;border-right-width:0.25rem;border-right-color:var(--wp--preset--color--green);border-right-style:dotted;border-bottom-width:0.5em;border-bottom-color:var(--wp--preset--color--blue);border-bottom-style:solid;border-left-width:1px;border-left-color:var(--wp--preset--color--yellow);border-left-style:solid;',
		);

		$this->assertSame( $expected, $actual );
	}
	/**
	 * Tests that stabilized border supports will also apply to blocks using
	 * the experimental syntax, for backwards compatibility with existing blocks.
	 *
	 * @covers ::gutenberg_apply_border_support
	 */
	public function test_should_apply_experimental_border_supports() {
		$this->test_block_name = 'test/experimental-border-supports';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 3,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'__experimentalBorder' => array(
						'color'                         => true,
						'radius'                        => true,
						'style'                         => true,
						'width'                         => true,
						'__experimentalDefaultControls' => array(
							'color'  => true,
							'radius' => true,
							'style'  => true,
							'width'  => true,
						),
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array(
			'style' => array(
				'border' => array(
					'color'  => '#72aee6',
					'radius' => '10px',
					'style'  => 'dashed',
					'width'  => '2px',
				),
			),
		);

		$actual   = gutenberg_apply_border_support( $block_type, $block_atts );
		$expected = array(
			'class' => 'has-border-color',
			'style' => 'border-color:#72aee6;border-radius:10px;border-style:dashed;border-width:2px;',
		);

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests that stabilized border supports are applied correctly.
	 *
	 * @covers ::gutenberg_apply_border_support
	 */
	public function test_should_apply_stabilized_border_supports() {
		$this->test_block_name = 'test/stabilized-border-supports';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 3,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'border' => array(
						'color'                         => true,
						'radius'                        => true,
						'style'                         => true,
						'width'                         => true,
						'__experimentalDefaultControls' => array(
							'color'  => true,
							'radius' => true,
							'style'  => true,
							'width'  => true,
						),
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array(
			'style' => array(
				'border' => array(
					'color'  => '#72aee6',
					'radius' => '10px',
					'style'  => 'dashed',
					'width'  => '2px',
				),
			),
		);

		$actual   = gutenberg_apply_border_support( $block_type, $block_atts );
		$expected = array(
			'class' => 'has-border-color',
			'style' => 'border-color:#72aee6;border-radius:10px;border-style:dashed;border-width:2px;',
		);

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests that experimental border support configuration gets stabilized correctly.
	 */
	public function test_should_stabilize_border_supports() {
		$block_type_args = array(
			'supports' => array(
				'__experimentalBorder' => array(
					'color'                           => true,
					'radius'                          => true,
					'style'                           => true,
					'width'                           => true,
					'__experimentalSkipSerialization' => true,
					'__experimentalDefaultControls'   => array(
						'color'  => true,
						'radius' => true,
						'style'  => true,
						'width'  => true,
					),
				),
			),
		);

		$actual   = gutenberg_stabilize_experimental_block_supports( $block_type_args );
		$expected = array(
			'supports' => array(
				'border' => array(
					'color'                           => true,
					'radius'                          => true,
					'style'                           => true,
					'width'                           => true,
					'skipSerialization'               => true,
					// Has to be kept due to core's `wp_should_skip_block_supports_serialization` only checking the experimental flag until 6.8.
					'__experimentalSkipSerialization' => true,
					'defaultControls'                 => array(
						'color'  => true,
						'radius' => true,
						'style'  => true,
						'width'  => true,
					),
				),
			),
		);

		$this->assertSame( $expected, $actual, 'Stabilized border block support config does not match.' );
	}

	/**
	 * Tests the merging of border support configuration when stabilizing
	 * experimental config. Due to the ability to filter block type args, plugins
	 * or themes could filter using outdated experimental keys. While not every
	 * permutation of filtering can be covered, the majority of use cases are
	 * served best by merging configs based on the order they were defined if possible.
	 */
	public function test_should_stabilize_border_supports_using_order_based_merge() {
		$experimental_border_config = array(
			'color'                           => true,
			'radius'                          => true,
			'style'                           => true,
			'width'                           => true,
			'__experimentalSkipSerialization' => true,
			'__experimentalDefaultControls'   => array(
				'color'  => true,
				'radius' => true,
				'style'  => true,
				'width'  => true,
			),

			/*
			 * The following simulates theme/plugin filtering using `__experimentalBorder`
			 * key but stable serialization and default control keys.
			 */
			'skipSerialization'               => false,
			'defaultControls'                 => array(
				'color'  => true,
				'radius' => false,
				'style'  => true,
				'width'  => true,
			),
		);
		$stable_border_config = array(
			'color'                           => true,
			'radius'                          => true,
			'style'                           => false,
			'width'                           => true,
			'skipSerialization'               => false,
			'defaultControls'                 => array(
				'color'  => true,
				'radius' => false,
				'style'  => false,
				'width'  => true,
			),

			/*
			 * The following simulates theme/plugin filtering using stable `border` key
			 * but experimental serialization and default control keys.
			 */
			'__experimentalSkipSerialization' => true,
			'__experimentalDefaultControls'   => array(
				'color'  => false,
				'radius' => false,
				'style'  => false,
				'width'  => false,
			),
		);

		$experimental_first_args = array(
			'supports' => array(
				'__experimentalBorder' => $experimental_border_config,
				'border'               => $stable_border_config,
			),
		);

		$actual   = gutenberg_stabilize_experimental_block_supports( $experimental_first_args );
		$expected = array(
			'supports' => array(
				'border' => array(
					'color'                           => true,
					'radius'                          => true,
					'style'                           => false,
					'width'                           => true,
					'skipSerialization'               => true,
					'__experimentalSkipSerialization' => true,
					'defaultControls'                 => array(
						'color'  => false,
						'radius' => false,
						'style'  => false,
						'width'  => false,
					),

				),
			),
		);
		$this->assertSame( $expected, $actual, 'Merged stabilized border block support config does not match when experimental keys are first.' );

		$stable_first_args = array(
			'supports' => array(
				'border'               => $stable_border_config,
				'__experimentalBorder' => $experimental_border_config,
			),
		);

		$actual   = gutenberg_stabilize_experimental_block_supports( $stable_first_args );
		$expected = array(
			'supports' => array(
				'border' => array(
					'color'                           => true,
					'radius'                          => true,
					'style'                           => true,
					'width'                           => true,
					'skipSerialization'               => false,
					'__experimentalSkipSerialization' => false,
					'defaultControls'                 => array(
						'color'  => true,
						'radius' => false,
						'style'  => true,
						'width'  => true,
					),
				),
			),
		);
		$this->assertSame( $expected, $actual, 'Merged stabilized border block support config does not match when stable keys are first.' );
	}
}
