# BoxControl

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-boxcontrol--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

A control that lets users set values for top, right, bottom, and left. Can be
used as an input control for values like `padding` or `margin`.

```jsx
import { useState } from 'react';
import { BoxControl } from '@wordpress/components';

function Example() {
  const [ values, setValues ] = useState( {
    top: '50px',
    left: '10%',
    right: '10%',
    bottom: '50px',
  } );

  return (
    <BoxControl
      values={ values }
      onChange={ setValues }
    />
  );
};
```
## Props

### `__next40pxDefaultSize`

Start opting into the larger default height that will become the default size in a future version.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `allowReset`

If this property is true, a button to reset the box control is rendered.

 - Type: `boolean`
 - Required: No
 - Default: `true`

### `id`

The id to use as a base for the unique HTML id attribute of the control.

 - Type: `string`
 - Required: No

### `inputProps`

Props for the internal `UnitControl` components.

 - Type: `UnitControlPassthroughProps`
 - Required: No
 - Default: `{
    	min: 0,
    }`

### `label`

Heading label for the control.

 - Type: `string`
 - Required: No
 - Default: `__( 'Box Control' )`

### `onChange`

A callback function when an input value changes.

 - Type: `(next: BoxControlValue) => void`
 - Required: No
 - Default: `() => {}`

### `resetValues`

The `top`, `right`, `bottom`, and `left` box dimension values to use when the control is reset.

 - Type: `BoxControlValue`
 - Required: No
 - Default: `{
    	top: undefined,
    	right: undefined,
    	bottom: undefined,
    	left: undefined,
    }`

### `sides`

Collection of sides to allow control of. If omitted or empty, all sides will be available.

Allowed values are "top", "right", "bottom", "left", "vertical", and "horizontal".

 - Type: `readonly (keyof BoxControlValue | "horizontal" | "vertical")[]`
 - Required: No

### `splitOnAxis`

If this property is true, when the box control is unlinked, vertical and horizontal controls
can be used instead of updating individual sides.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `units`

Available units to select from.

 - Type: `WPUnitControlUnit[]`
 - Required: No
 - Default: `CSS_UNITS`

### `values`

The current values of the control, expressed as an object of `top`, `right`, `bottom`, and `left` values.

 - Type: `BoxControlValue`
 - Required: No
