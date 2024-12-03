/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import type { WordPressComponentProps } from '../context';
import type { FormFileUploadProps } from './types';
import { maybeWarnDeprecated36pxSize } from '../utils/deprecated-36px-size';

/**
 * FormFileUpload allows users to select files from their local device.
 *
 * ```jsx
 * import { FormFileUpload } from '@wordpress/components';
 *
 * const MyFormFileUpload = () => (
 *   <FormFileUpload
 *     __next40pxDefaultSize
 *     accept="image/*"
 *     onChange={ ( event ) => console.log( event.currentTarget.files ) }
 *   >
 *     Upload
 *   </FormFileUpload>
 * );
 * ```
 */
export function FormFileUpload( {
	accept,
	children,
	multiple = false,
	onChange,
	onClick,
	render,
	...props
}: WordPressComponentProps< FormFileUploadProps, 'button', false > ) {
	const ref = useRef< HTMLInputElement >( null );
	const openFileDialog = () => {
		ref.current?.click();
	};

	if ( ! render ) {
		maybeWarnDeprecated36pxSize( {
			componentName: 'FormFileUpload',
			__next40pxDefaultSize: props.__next40pxDefaultSize,
			// @ts-expect-error - We don't "officially" support all Button props but this likely happens.
			size: props.size,
		} );
	}

	const ui = render ? (
		render( { openFileDialog } )
	) : (
		<Button onClick={ openFileDialog } { ...props }>
			{ children }
		</Button>
	);
	// @todo: Temporary fix a bug that prevents Chromium browsers from selecting ".heic" files
	// from the file upload. See https://core.trac.wordpress.org/ticket/62268#comment:4.
	// This can be removed once the Chromium fix is in the stable channel.
	// Prevent Safari from adding "image/heic" and "image/heif" to the accept attribute.
	const isSafari =
		globalThis.window?.navigator.userAgent.includes( 'Safari' ) &&
		! globalThis.window?.navigator.userAgent.includes( 'Chrome' ) &&
		! globalThis.window?.navigator.userAgent.includes( 'Chromium' );
	const compatAccept =
		! isSafari && !! accept?.includes( 'image/*' )
			? `${ accept }, image/heic, image/heif`
			: accept;

	return (
		<div className="components-form-file-upload">
			{ ui }
			<input
				type="file"
				ref={ ref }
				multiple={ multiple }
				style={ { display: 'none' } }
				accept={ compatAccept }
				onChange={ onChange }
				onClick={ onClick }
				data-testid="form-file-upload-input"
			/>
		</div>
	);
}

export default FormFileUpload;
