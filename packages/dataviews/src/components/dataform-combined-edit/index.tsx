/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { DataFormCombinedEditProps, NormalizedField } from '../../types';
import FormFieldVisibility from '../form-field-visibility';

function Header( { title }: { title: string } ) {
	return (
		<VStack className="dataforms-layouts__dropdown-header" spacing={ 4 }>
			<HStack alignment="center">
				<Heading level={ 2 } size={ 13 }>
					{ title }
				</Heading>
				<Spacer />
			</HStack>
		</VStack>
	);
}

function DataFormCombinedEdit< Item >( {
	field,
	data,
	onChange,
	hideLabelFromVision,
}: DataFormCombinedEditProps< Item > ) {
	const className = 'dataforms-combined-edit';
	const visibleChildren = ( field.children ?? [] )
		.map( ( fieldId ) => field.fields.find( ( { id } ) => id === fieldId ) )
		.filter(
			( childField ): childField is NormalizedField< Item > =>
				!! childField
		);
	const children = visibleChildren.map( ( child ) => {
		return (
			<FormFieldVisibility key={ child.id } data={ data } field={ child }>
				<div className="dataforms-combined-edit__field">
					<child.Edit
						data={ data }
						field={ child }
						onChange={ onChange }
					/>
				</div>
			</FormFieldVisibility>
		);
	} );

	const Stack = field.direction === 'horizontal' ? HStack : VStack;

	return (
		<>
			{ ! hideLabelFromVision && <Header title={ field.label } /> }
			<Stack spacing={ 4 } className={ className } as="fieldset">
				{ children }
			</Stack>
		</>
	);
}

export default DataFormCombinedEdit;
