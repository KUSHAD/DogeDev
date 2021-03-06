import { Card, Input, Icon, Button } from 'react-native-elements';
import Container from '../../Components/Container';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { environment } from '../../environment';
export default function Email() {
	const { authUser, updateEmail, isLoading } = useAuthProvider();
	const { control, handleSubmit, reset } = useForm({
		mode: 'all',
		defaultValues: {
			email: authUser.email,
		},
	});
	async function onSubmit(data) {
		await updateEmail(data);
		reset();
	}
	return (
		<Container>
			<Card containerStyle={{ width: `80%` }}>
				<Card.Title h3>Update Email</Card.Title>
				<Controller
					control={control}
					name='email'
					rules={{
						required: 'Email is required',
						pattern: {
							value: environment.validationRegex.email,
							message: 'Enter a valid email',
						},
					}}
					render={({
						field: { onChange, onBlur, value },
						formState: { errors },
					}) => (
						<Input
							autoComplete='email'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label='Email'
							leftIcon={<Icon name='email' />}
							errorMessage={errors?.email?.message}
						/>
					)}
				/>
				<Button
					title='Update Email'
					raised
					loading={isLoading}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</Container>
	);
}
