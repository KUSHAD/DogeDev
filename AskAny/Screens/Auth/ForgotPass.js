import { Card, Button, Input, Icon, Text, colors } from 'react-native-elements';
import Container from '../../Components/Container';
import { useForm, Controller } from 'react-hook-form';
import { environment } from '../../environment';
import { useAuthProvider } from '../../Providers/AuthProvider';

export default function ForgotPass({ navigation }) {
	const { isLoading, resetPass } = useAuthProvider();
	const { control, handleSubmit } = useForm({
		defaultValues: {
			email: '',
		},
		mode: 'all',
	});
	return (
		<Container>
			<Card>
				<Card.Title h1>AskAny DogeDev</Card.Title>
				<Card.Image source={require('../../assets/icon.png')} />
				<Card.Title h4>Reset Password</Card.Title>
				<Controller
					control={control}
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
							leftIcon={<Icon name='email' />}
							label='Email'
							autoComplete='email'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							errorMessage={errors?.email?.message}
						/>
					)}
					name='email'
				/>
				<Button
					onPress={handleSubmit(resetPass)}
					title='Reset Password'
					raised
					loading={isLoading}
				/>
				<Card.Divider />
				<Button
					title='Back to login'
					type='clear'
					style={{ marginBottom: 10 }}
					onPress={() => navigation.navigate('Login')}
				/>
				<Text>
					Need an account ?{' '}
					<Text
						style={{ color: colors.primary }}
						onPress={() => navigation.navigate('Signup')}
					>
						Signup
					</Text>
				</Text>
			</Card>
		</Container>
	);
}
