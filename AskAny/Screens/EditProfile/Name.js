import { Card, Input, Icon, Button } from 'react-native-elements';
import Container from '../../Components/Container';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
export default function Name() {
	const { authUser, updateName, isLoading } = useAuthProvider();
	const { control, handleSubmit, reset } = useForm({
		mode: 'all',
		defaultValues: {
			name: authUser.name,
		},
	});
	async function onSubmit(data) {
		await updateName(data);
		reset();
	}
	return (
		<Container>
			<Card containerStyle={{ width: `80%` }}>
				<Card.Title h3>Update Name</Card.Title>
				<Controller
					control={control}
					name='name'
					rules={{
						required: 'Name is required',
					}}
					render={({
						field: { onChange, onBlur, value },
						formState: { errors },
					}) => (
						<Input
							autoComplete='name'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label='Name'
							leftIcon={<Icon name='person' />}
							errorMessage={errors?.name?.message}
						/>
					)}
				/>
				<Button
					title='Update Name'
					raised
					loading={isLoading}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</Container>
	);
}
