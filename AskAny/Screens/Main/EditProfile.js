import { Card, Input, Icon, Button } from 'react-native-elements';
import Container from '../../Components/Container';
import { useForm, Controller } from 'react-hook-form';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { environment } from '../../environment';

export default function EditProfile({ navigation, route }) {
	const { authUser, updatePass, updateEmail, updateName } = useAuthProvider();
	const [isVisible, setIsVisible] = useState(false);
	const [confVisible, setConfVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { control, handleSubmit, watch } = useForm({
		defaultValues: {
			email: route.params?.email,
			name: route.params?.name,
			pass: '',
			confirmPass: '',
		},
	});

	const watchField = watch('pass');

	async function onSubmit({ name, email, pass }) {
		try {
			setIsLoading(true);
			if (name !== authUser.name) {
				await updateName({ name });
			}
			if (email !== authUser.email) {
				await updateEmail({ email });
			}
			if (pass) {
				await updatePass({ pass });
			}
			Toast.showWithGravity('Profile Update Successfully');
			navigation.pop();
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Container>
			<Card containerStyle={{ width: `80%` }}>
				<Card.Title h2>Update Your Profile</Card.Title>
				<Controller
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
					control={control}
					name='name'
				/>
				<Controller
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
					control={control}
					name='email'
				/>
				<Controller
					rules={{
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
					control={control}
					name='pass'
				/>
				<Controller
					rules={{
						required: {
							value: Boolean(watchField),
							message: 'Password confirmation is required',
						},
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
							errorMessage={errors?.confirmPass?.message}
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
					control={control}
					name='confirmPass'
				/>
				<Button
					title='Update'
					raised
					loading={isLoading}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</Container>
	);
}
