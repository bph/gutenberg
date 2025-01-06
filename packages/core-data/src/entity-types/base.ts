/**
 * Internal dependencies
 */
import type { Context, OmitNevers } from './helpers';
import type { BaseEntityRecords as _BaseEntityRecords } from './base-entity-records';

export type TemplatePartArea = {
	area: string;
	label: string;
	icon: string;
	description: string;
};

export type TemplateType = {
	title: string;
	description: string;
	slug: string;
};

declare module './base-entity-records' {
	export namespace BaseEntityRecords {
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
		export interface Base< C extends Context > {
			/**
			 * Site description.
			 */
			description: string;

			/**
			 * GMT offset for the site.
			 */
			gmt_offset: string;

			/**
			 * Home URL.
			 */
			home: string;

			/**
			 * Site title
			 */
			name: string;

			/**
			 * Site icon ID.
			 */
			site_icon?: number;

			/**
			 * Site icon URL.
			 */
			site_icon_url: string;

			/**
			 * Site logo ID.
			 */
			site_logo?: number;

			/**
			 * Site timezone string.
			 */
			timezone_string: string;

			/**
			 * Site URL.
			 */
			url: string;

			/**
			 * Default template part areas.
			 */
			default_template_part_areas?: Array< TemplatePartArea >;

			/**
			 * Default template types
			 */
			default_template_types?: Array< TemplateType >;
		}
	}
}

export type Base< C extends Context = 'edit' > = OmitNevers<
	_BaseEntityRecords.Base< C >
>;
