# Icon

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-icon--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

Renders a raw icon without any initial styling or wrappers.

```jsx
import { wordpress } from '@wordpress/icons';

<Icon icon={ wordpress } />
```
## Props

### `icon`

The icon to render. In most cases, you should use an icon from
[the `@wordpress/icons` package](https://wordpress.github.io/gutenberg/?path=/story/icons-icon--library).

Other supported values are: component instances, functions,
[Dashicons](https://developer.wordpress.org/resource/dashicons/)
(specified as strings), and `null`.

The `size` value, as well as any other additional props, will be passed through.

 - Type: `IconType`
 - Required: No
 - Default: `null`

### `size`

The size (width and height) of the icon.

Defaults to `20` when `icon` is a string (i.e. a Dashicon id), otherwise `24`.

 - Type: `number`
 - Required: No
 - Default: `'string' === typeof icon ? 20 : 24`
