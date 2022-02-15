import { Card, Input, Icon, Button } from 'react-native-elements';
import Container from '../../Components/Container';
import { useAuthProvider } from '../../Providers/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
export default function Password() {
	const [isVisible, setIsVisible] = useState(false);
	const [confVisible, setConfVisible] = useState(false);

	const { updatePass, isLoading } = useAuthProvider();
	const { control, handleSubmit, watch, reset } = useForm({
		mode: 'all',
		defaultValues: {
			pass: '',
			confirmPass: '',
		},
	});

	const watchField = watch('pass');
	async function onSubmit(data) {
		await updatePass(data);
		reset();
		setIsVisible(false);
		setConfVisible(false);
	}

	return (
		<Container>
			<Card containerStyle={{ width: `80%` }}>
				<Card.Title h3>Update Password</Card.Title>
				<Controller
					control={control}
					name='pass'
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
							label='Password'
							leftIcon={<Icon name='lock' />}
							errorMessage={errors?.pass?.message}
							autoComplete='new-password'
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
						/>
					)}
				/>
				<Controller
					control={control}
					name='confirmPass'
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
							label='Password confirmation'
							leftIcon={<Icon name='lock' />}
							errorMessage={errors?.confirmPass?.message}
							autoComplete='password'
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
						/>
					)}
				/>
				<Button
					title='Update Password'
					raised
					loading={isLoading}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</Container>
	);
}
