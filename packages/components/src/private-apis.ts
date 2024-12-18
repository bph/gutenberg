/**
 * Internal dependencies
 */
import { positionToPlacement as __experimentalPopoverLegacyPositionToPlacement } from './popover/utils';
import { Menu } from './menu';
import { ComponentsContext } from './context/context-system-provider';
import Theme from './theme';
import { Tabs } from './tabs';
import { kebabCase } from './utils/strings';
import { lock } from './lock-unlock';
import Badge from './badge';

export const privateApis = {};
lock( privateApis, {
	__experimentalPopoverLegacyPositionToPlacement,
	ComponentsContext,
	Tabs,
	Theme,
	Menu,
	kebabCase,
	Badge,
} );
