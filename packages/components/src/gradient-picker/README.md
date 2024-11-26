# GradientPicker

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-gradientpicker--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

GradientPicker is a React component that renders a color gradient picker to
define a multi step gradient. There's either a _linear_ or a _radial_ type
available.

```jsx
import { useState } from 'react';
import { GradientPicker } from '@wordpress/components';

const MyGradientPicker = () => {
  const [ gradient, setGradient ] = useState( null );

  return (
    <GradientPicker
      value={ gradient }
      onChange={ ( currentGradient ) => setGradient( currentGradient ) }
      gradients={ [
        {
          name: 'JShine',
          gradient:
            'linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)',
          slug: 'jshine',
        },
        {
          name: 'Moonlit Asteroid',
          gradient:
            'linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)',
          slug: 'moonlit-asteroid',
        },
        {
          name: 'Rastafarie',
          gradient:
            'linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)',
          slug: 'rastafari',
        },
      ] }
    />
  );
};
```
## Props

### `__experimentalIsRenderedInSidebar`

Whether this is rendered in the sidebar.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `asButtons`

Whether the control should present as a set of buttons,
each with its own tab stop.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `aria-label`

A label to identify the purpose of the control.

 - Type: `string`
 - Required: No

### `aria-labelledby`

An ID of an element to provide a label for the control.

 - Type: `string`
 - Required: No

### `className`

The class name added to the wrapper.

 - Type: `string`
 - Required: No

### `clearable`

Whether the palette should have a clearing button or not.

 - Type: `boolean`
 - Required: No
 - Default: `true`

### `disableCustomGradients`

If true, the gradient picker will not be displayed and only defined
gradients from `gradients` will be shown.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `gradients`

An array of objects as predefined gradients displayed above the gradient
selector. Alternatively, if there are multiple sets (or 'origins') of
gradients, you can pass an array of objects each with a `name` and a
`gradients` array which will in turn contain the predefined gradient objects.

 - Type: `GradientsProp`
 - Required: No
 - Default: `[]`

### `headingLevel`

The heading level. Only applies in cases where gradients are provided
from multiple origins (i.e. when the array passed as the `gradients` prop
contains two or more items).

 - Type: `1 | 2 | 3 | 4 | 5 | 6 | "1" | "2" | "3" | "4" | ...`
 - Required: No
 - Default: `2`

### `loop`

Prevents keyboard interaction from wrapping around.
Only used when `asButtons` is not true.

 - Type: `boolean`
 - Required: No
 - Default: `true`

### `onChange`

The function called when a new gradient has been defined. It is passed to
the `currentGradient` as an argument.

 - Type: `(currentGradient: string) => void`
 - Required: Yes

### `value`

The current value of the gradient. Pass a css gradient string (See default value for example).
Optionally pass in a `null` value to specify no gradient is currently selected.

 - Type: `string`
 - Required: No
 - Default: `'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)'`
