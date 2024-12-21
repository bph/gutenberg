/**
 * WordPress dependencies
 */
import { box, button, cog, paragraph } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import BlockCard from '../';

const meta = {
	title: 'BlockEditor/BlockCard',
	component: BlockCard,
	parameters: {
		docs: {
			description: {
				component:
					'The `BlockCard` component allows to display a "card" which contains the title of a block, its icon and its description.',
			},
			canvas: { sourceState: 'shown' },
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the block.',
			table: {
				type: { summary: 'string' },
			},
		},
		description: {
			control: 'text',
			description: 'A description of the block functionality.',
			table: {
				type: { summary: 'string' },
			},
		},
		icon: {
			control: 'select',
			options: [ 'paragraph', 'cog', 'box', 'button' ],
			mapping: {
				paragraph,
				cog,
				box,
				button,
			},
			description:
				'The icon of the block. This can be any of [WordPress Dashicons](https://developer.wordpress.org/resource/dashicons/), or a custom `svg` element.',
			table: {
				type: { summary: 'string | object' },
			},
		},
		name: {
			control: 'text',
			description: 'Optional custom name for the block.',
			table: {
				type: { summary: 'string' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names.',
			table: {
				type: { summary: 'string' },
			},
		},
	},
};

export default meta;

export const Default = {
	args: {
		title: 'Paragraph',
		icon: paragraph,
		description: 'This is a paragraph block description.',
		name: 'Paragraph Block',
	},
};
