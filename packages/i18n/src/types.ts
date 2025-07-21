/**
 * Return type for string translation functions.
 *
 * This type should be treated as if it were `string`.
 */
export type TranslatableText< T extends string > = string & {
	/**
	 * DO NOT USE! This property _does not exist_.
	 * @private
	 */
	readonly __translatableText: T;
};
