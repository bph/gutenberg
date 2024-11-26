/**
 * Internal dependencies
 */
import PostTypeSupportCheck from '../post-type-support-check';

/**
 * Wrapper component that renders its children only if the post type supports the slug.
 *
 * @param {Object}          props          Props.
 * @param {React.ReactNode} props.children Children to be rendered.
 *
 * @return {React.ReactNode} The rendered component.
 */
export default function PostSlugCheck( { children } ) {
	return (
		<PostTypeSupportCheck supportKeys="slug">
			{ children }
		</PostTypeSupportCheck>
	);
}
