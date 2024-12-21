# FormFileUpload

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-formfileupload--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

FormFileUpload allows users to select files from their local device.

```jsx
import { FormFileUpload } from '@wordpress/components';

const MyFormFileUpload = () => (
  <FormFileUpload
    __next40pxDefaultSize
    accept="image/*"
    onChange={ ( event ) => console.log( event.currentTarget.files ) }
  >
    Upload
  </FormFileUpload>
);
```

## Props

### `__next40pxDefaultSize`

Start opting into the larger default height that will become the default size in a future version.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `accept`

A string passed to the `input` element that tells the browser which
[file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)
can be uploaded by the user. e.g: `image/*,video/*`.

 - Type: `string`
 - Required: No

### `children`

Children are passed as children of `Button`.

 - Type: `ReactNode`
 - Required: No

### `icon`

The icon to render in the default button.

See the `Icon` component docs for more information.

 - Type: `IconType`
 - Required: No

### `multiple`

Whether to allow multiple selection of files or not.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `onChange`

Callback function passed directly to the `input` file element.

Select files will be available in `event.currentTarget.files`.

 - Type: `ChangeEventHandler<HTMLInputElement>`
 - Required: Yes

### `onClick`

Callback function passed directly to the `input` file element.

This can be useful when you want to force a `change` event to fire when
the user chooses the same file again. To do this, set the target value to
an empty string in the `onClick` function.

```jsx
<FormFileUpload
  __next40pxDefaultSize
  onClick={ ( event ) => ( event.target.value = '' ) }
  onChange={ onChange }
>
  Upload
</FormFileUpload>
```

 - Type: `MouseEventHandler<HTMLInputElement>`
 - Required: No

### `render`

Optional callback function used to render the UI.

If passed, the component does not render the default UI (a button) and
calls this function to render it. The function receives an object with
property `openFileDialog`, a function that, when called, opens the browser
native file upload modal window.

 - Type: `(arg: { openFileDialog: () => void; }) => ReactNode`
 - Required: No
