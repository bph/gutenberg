# Button

<!-- This file is generated automatically and cannot be edited directly. Make edits via TypeScript types and TSDocs. -->

<p class="callout callout-info">See the <a href="https://wordpress.github.io/gutenberg/?path=/docs/components-button--docs">WordPress Storybook</a> for more detailed, interactive documentation.</p>

Lets users take actions and make choices with a single click or tap.

```jsx
import { Button } from '@wordpress/components';
const Mybutton = () => (
  <Button
    variant="primary"
    onClick={ handleClick }
  >
    Click here
  </Button>
);
```

## Props

### `__next40pxDefaultSize`

Start opting into the larger default height that will become the
default size in a future version.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `accessibleWhenDisabled`

Whether to keep the button focusable when disabled.

In most cases, it is recommended to set this to `true`. Disabling a control without maintaining focusability
can cause accessibility issues, by hiding their presence from screen reader users,
or by preventing focus from returning to a trigger element.

Learn more about the [focusability of disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols)
in the WAI-ARIA Authoring Practices Guide.

 - Type: `boolean`
 - Required: No
 - Default: `false`

### `children`

The button's children.

 - Type: `ReactNode`
 - Required: No

### `description`

A visually hidden accessible description for the button.

 - Type: `string`
 - Required: No

### `disabled`

Whether the button is disabled. If `true`, this will force a `button` element
to be rendered, even when an `href` is given.

In most cases, it is recommended to also set the `accessibleWhenDisabled` prop to `true`.

 - Type: `boolean`
 - Required: No

### `href`

If provided, renders `a` instead of `button`.

 - Type: `string`
 - Required: Yes

### `icon`

If provided, renders an Icon component inside the button.

 - Type: `IconType`
 - Required: No

### `iconPosition`

If provided with `icon`, sets the position of icon relative to the `text`.

 - Type: `"left" | "right"`
 - Required: No
 - Default: `'left'`

### `iconSize`

If provided with `icon`, sets the icon size.
Please refer to the Icon component for more details regarding
the default value of its `size` prop.

 - Type: `number`
 - Required: No

### `isBusy`

Indicates activity while a action is being performed.

 - Type: `boolean`
 - Required: No

### `isDestructive`

Renders a red text-based button style to indicate destructive behavior.

 - Type: `boolean`
 - Required: No

### `isPressed`

Renders a pressed button style.

 - Type: `boolean`
 - Required: No

### `label`

Sets the `aria-label` of the component, if none is provided.
Sets the Tooltip content if `showTooltip` is provided.

 - Type: `string`
 - Required: No

### `shortcut`

If provided with `showTooltip`, appends the Shortcut label to the tooltip content.
If an object is provided, it should contain `display` and `ariaLabel` keys.

 - Type: `string | { display: string; ariaLabel: string; }`
 - Required: No

### `showTooltip`

If provided, renders a Tooltip component for the button.

 - Type: `boolean`
 - Required: No

### `size`

The size of the button.

- `'default'`: For normal text-label buttons, unless it is a toggle button.
- `'compact'`: For toggle buttons, icon buttons, and buttons when used in context of either.
- `'small'`: For icon buttons associated with more advanced or auxiliary features.

If the deprecated `isSmall` prop is also defined, this prop will take precedence.

 - Type: `"small" | "default" | "compact"`
 - Required: No
 - Default: `'default'`

### `text`

If provided, displays the given text inside the button. If the button contains children elements, the text is displayed before them.

 - Type: `string`
 - Required: No

### `tooltipPosition`

If provided with `showTooltip`, sets the position of the tooltip.
Please refer to the Tooltip component for more details regarding the defaults.

 - Type: `"top" | "middle" | "bottom" | "top center" | "top left" | "top right" | "middle center" | "middle left" | "middle right" | "bottom center" | ...`
 - Required: No

### `target`

If provided with `href`, sets the `target` attribute to the `a`.

 - Type: `string`
 - Required: No

### `variant`

Specifies the button's style.

The accepted values are:

1. `'primary'` (the primary button styles)
2. `'secondary'` (the default button styles)
3. `'tertiary'` (the text-based button styles)
4. `'link'` (the link button styles)

 - Type: `"link" | "primary" | "secondary" | "tertiary"`
 - Required: No
