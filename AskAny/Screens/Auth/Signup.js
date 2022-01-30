import { Text, Card, Input, Button, colors, Icon } from 'react-native-elements';
import Container from '../../Components/Container';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { environment } from '../../environment';
export default function Signup({ navigation }) {
	const { isLoading, signup } = useAuthProvider();
	const [isVisible, setIsVisible] = useState(false);
	const [confVisible, setConfVisible] = useState(false);
	const { control, handleSubmit, watch } = useForm({
		defaultValues: {
			email: '',
			pass: '',
			verifyPass: '',
			name: '',
		},
		mode: 'all',
	});
	const watchField = watch('pass');
	async function onSubmit({ email, name, pass }) {
		await signup({ email, name, pass, navigation });
	}
	return (
		<Container>
			<Card>
				<Card.Title h1>AskAny DogeDev</Card.Title>
				<Card.Image source={require('../../assets/icon.png')} />
				<Card.Title h4>Signup</Card.Title>
				<Controller
					control={control}
					rules={{
						required: 'Name is required',
					}}
					render={({
						field: { onChange, onBlur, value },
						formState: { errors },
					}) => (
						<Input
							leftIcon={<Icon name='person' />}
							label='Name'
							autoComplete='name'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							errorMessage={errors?.name?.message}
						/>
					)}
					name='name'
				/>

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
										name='visibility-off'
										activeOpacity={0.2}
										onPress={() => setIsVisible(false)}
									/>
								) : (
									<Icon
										name='visibility'
										activeOpacity={0.2}
										onPress={() => setIsVisible(true)}
									/>
								)
							}
							autoComplete='new-password'
						/>
					)}
					name='pass'
				/>
				<Controller
					control={control}
					rules={{
						required: 'Password confirmation is required',
						validate: value => value === watchField || `Passwords don't match`,
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
							label='Confirm Password'
							errorMessage={errors?.verifyPass?.message}
							secureTextEntry={!confVisible}
							rightIcon={
								confVisible ? (
									<Icon
										name='visibility-off'
										activeOpacity={0.2}
										onPress={() => setConfVisible(false)}
									/>
								) : (
									<Icon
										name='visibility'
										activeOpacity={0.2}
										onPress={() => setConfVisible(true)}
									/>
								)
							}
							autoComplete='password'
						/>
					)}
					name='verifyPass'
				/>
				<Button
					onPress={handleSubmit(onSubmit)}
					loading={isLoading}
					raised
					title='Signup'
				/>
				<Card.Divider />
				<Text>
					Already have an account ?{' '}
					<Text
						style={{ color: colors.primary }}
						onPress={() => navigation.navigate('Login')}
					>
						Login
					</Text>
				</Text>
			</Card>
		</Container>
	);
}
