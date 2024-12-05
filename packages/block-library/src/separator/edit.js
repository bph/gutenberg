/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { HorizontalRule, SelectControl } from '@wordpress/components';
import {
	useBlockProps,
	getColorClassName,
	__experimentalUseColorProps as useColorProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useDeprecatedOpacity from './use-deprecated-opacity';

const htmlElementMessages = {
	div: __(
		'The <div> element should only be used if the separator is a design element that should not be announced.'
	),
};

export default function SeparatorEdit( { attributes, setAttributes } ) {
	const { backgroundColor, opacity, style, tagName } = attributes;
	const colorProps = useColorProps( attributes );
	const currentColor = colorProps?.style?.backgroundColor;
	const hasCustomColor = !! style?.color?.background;

	useDeprecatedOpacity( opacity, currentColor, setAttributes );

	// The dots styles uses text for the dots, to change those dots color is
	// using color, not backgroundColor.
	const colorClass = getColorClassName( 'color', backgroundColor );

	const className = clsx(
		{
			'has-text-color': backgroundColor || currentColor,
			[ colorClass ]: colorClass,
			'has-css-opacity': opacity === 'css',
			'has-alpha-channel-opacity': opacity === 'alpha-channel',
		},
		colorProps.className
	);

	const styles = {
		color: currentColor,
		backgroundColor: currentColor,
	};
	const Wrapper = tagName === 'hr' ? HorizontalRule : tagName;

	return (
		<>
			<InspectorControls group="advanced">
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'HTML element' ) }
					options={ [
						{ label: __( 'Default (<hr>)' ), value: 'hr' },
						{ label: '<div>', value: 'div' },
					] }
					value={ tagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					help={ htmlElementMessages[ tagName ] }
				/>
			</InspectorControls>
			<Wrapper
				{ ...useBlockProps( {
					className,
					style: hasCustomColor ? styles : undefined,
				} ) }
			/>
		</>
	);
}
