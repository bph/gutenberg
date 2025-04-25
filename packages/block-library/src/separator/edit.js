/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { HorizontalRule } from '@wordpress/components';
import {
	useBlockProps,
	getColorClassName,
	__experimentalUseColorProps as useColorProps,
	InspectorControls,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useDeprecatedOpacity from './use-deprecated-opacity';
import { unlock } from '../lock-unlock';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

export default function SeparatorEdit( {
	attributes,
	setAttributes,
	clientId,
} ) {
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
				<HTMLElementControl
					tagName={ tagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					clientId={ clientId }
					options={ [
						{ label: __( 'Default (<hr>)' ), value: 'hr' },
						{ label: '<div>', value: 'div' },
					] }
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
