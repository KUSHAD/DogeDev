import { SafeAreaView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Container from '../../Components/Container';
import { Controller, useForm } from 'react-hook-form';
export default function NewQuestion({ navigation }) {
	const { handleSubmit, control } = useForm({
		mode: 'all',
		defaultValues: {
			title: '',
			desc: '',
		},
	});
	function onSubmit({ title, desc }) {
		navigation.navigate('AdditionalConfigsQ', { title, desc });
	}
	return (
		<Container>
			<SafeAreaView
				style={{
					width: `80%`,
				}}
			>
				<Controller
					rules={{
						required: 'Question title is required',
						maxLength: {
							value: 100,
							message: 'Question title shoulbe be maximum 100 characters',
						},
					}}
					control={control}
					name='title'
					render={({
						formState: { errors },
						field: { onBlur, onChange, value },
					}) => (
						<Input
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							label='Question Title'
							errorMessage={errors?.title?.message}
						/>
					)}
				/>
				<Controller
					rules={{
						required: 'Question Description is required',
						maxLength: {
							value: 500,
							message: 'Description should be maximum 500 characters',
						},
					}}
					control={control}
					name='desc'
					render={({
						formState: { errors },
						field: { onBlur, onChange, value },
					}) => (
						<Input
							multiline
							numberOfLines={10}
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							label='Question Description'
							errorMessage={errors?.desc?.message}
						/>
					)}
				/>
				<Button title='Next' raised onPress={handleSubmit(onSubmit)} />
			</SafeAreaView>
		</Container>
	);
}
