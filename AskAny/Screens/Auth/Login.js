import Container from '../../Components/Container';
import { Card, Button, Input, Icon, Text, colors } from 'react-native-elements';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { environment } from '../../environment';

export default function Login({ navigation }) {
	const { login, isLoading } = useAuthProvider();
	const [isVisible, setIsVisible] = useState(false);
	const { control, handleSubmit } = useForm({
		defaultValues: {
			email: '',
			pass: '',
		},
		mode: 'all',
	});
	return (
		<Container>
			<Card>
				<Card.Title h1>AskAny DogeDev</Card.Title>
				<Card.Image source={require('../../assets/icon.png')} />
				<Card.Title h4>Login</Card.Title>
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
				<Controller
					control={control}
					rules={{
						required: 'Password is required',
						minLength: {
							value: 6,
							message: 'Password should be atleast 6 characters',
						},
						maxLength: {
							value: 15,
							message: 'Passwords should be maximum 15 characters long',
						},
					}}
					render={({
						field: { onChange, onBlur, value },
						formState: { errors },
					}) => (
						<Input
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							leftIcon={<Icon name='lock' />}
							label='Password'
							errorMessage={errors?.pass?.message}
							secureTextEntry={!isVisible}
							rightIcon={
								isVisible ? (
									<Icon
										name='visibility'
										activeOpacity={0.2}
										onPress={() => setIsVisible(false)}
									/>
								) : (
									<Icon
										name='visibility-off'
										activeOpacity={0.2}
										onPress={() => setIsVisible(true)}
									/>
								)
							}
							autoComplete='password'
						/>
					)}
					name='pass'
				/>
				<Button
					onPress={handleSubmit(login)}
					title='Login'
					raised
					loading={isLoading}
				/>
				<Card.Divider />
				<Button
					title='Forgot Password ?'
					type='clear'
					style={{ marginBottom: 10 }}
					onPress={() => navigation.navigate('ForgotPass')}
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
