import Centered from '../Components/Centered';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useForm } from 'react-hook-form';
import constants from '../constants';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Loading from '../Components/Loading';
import { useAuthProvider } from '../context/Auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export default function Auth() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, dirtyFields },
	} = useForm({
		mode: 'all',
		defaultValues: {
			ph: '',
			otp: '',
		},
	});
	const { setUser, setIsOwner } = useAuthProvider();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showCodeInput, setShowCodeInput] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const history = useHistory();
	function sendOTP(data) {
		setError('');
		setSuccess('');
		setIsSubmitting(true);
		window.appVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{
				size: 'invisible',
			},
			firebaseAuth
		);
		const fullNumber = `+91${data.ph}`;
		const appVerifier = window.appVerifier;
		signInWithPhoneNumber(firebaseAuth, fullNumber, appVerifier)
			.then(result => {
				window.confirmationResult = result;
				setSuccess('OTP sent in Your Message Succesfully');
				setShowCodeInput(true);
			})
			.catch(err => {
				setShowCodeInput(false);
				setError(
					`${err.message}Please refresh the page and authenticate yourself again`
				);
			})
			.finally(() => setIsSubmitting(false));
	}
	function verifyOTP(data) {
		setSuccess('');
		setError('');
		setIsSubmitting(true);
		window.confirmationResult
			.confirm(data.otp)
			.then(async () => {
				const findNums = await constants.ADMIN_PHONES.includes(data.ph);
				if (findNums) setIsOwner(true);
				window.sessionStorage.setItem(
					'authUser',
					JSON.stringify({
						ph: data.ph,
						owner: findNums ? true : false,
					})
				);
				setUser(data.ph);
				setSuccess('OTP Verified');
				setShowCodeInput(false);
				history.push('/');
			})
			.catch(err => {
				setShowCodeInput(false);
				setError(
					`${err.message}Please refresh the page and authenticate yourself again`
				);
			})
			.finally(() => setIsSubmitting(false));
	}
	useEffect(() => {
		return () => {
			reset();
			setIsSubmitting(false);
			setShowCodeInput(false);
		};
	}, [reset]);
	return (
		<>
			<Loading isOpen={isSubmitting} />
			<div id='recaptcha-container' />
			<Centered>
				<Card>
					<Card.Body>
						<h2 className='text-center mb-4'>Login</h2>
						{error && (
							<Alert dismissible onClose={() => setError('')} variant='danger'>
								<Alert.Heading>Error</Alert.Heading>
								<p>{error}</p>
							</Alert>
						)}
						{success && (
							<Alert
								dismissible
								onClose={() => setSuccess('')}
								variant='success'
							>
								<Alert.Heading>Success</Alert.Heading>
								<p>{success}</p>
							</Alert>
						)}
						<Form
							noValidate
							onSubmit={
								showCodeInput ? handleSubmit(verifyOTP) : handleSubmit(sendOTP)
							}
						>
							<Form.Group id='mb' className='mb-2'>
								<FloatingLabel label='Mobile number *'>
									<Form.Control
										isInvalid={errors?.ph}
										isValid={dirtyFields?.ph && !errors?.ph}
										disabled={isSubmitting || showCodeInput}
										readOnly={isSubmitting || showCodeInput}
										type='tel'
										{...register('ph', {
											required: {
												value: showCodeInput ? false : true,
												message: 'Phone number is required',
											},
											validate: async value => {
												if (value.length !== 10)
													return 'Mobile number should have 10 digits';

												const findNums = await constants.VALID_PHONES.filter(
													ph => ph === value
												);
												if (value.length === 10 && findNums.length === 0)
													return 'You are not authorised to use this feature';
											},
										})}
										placeholder='d'
									/>
								</FloatingLabel>
								<Form.Text className='text-danger'>
									{errors?.ph?.message}
								</Form.Text>
							</Form.Group>
							{showCodeInput && (
								<Form.Group id='otp' className='mb-2'>
									<FloatingLabel label='OTP *'>
										<Form.Control
											type='tel'
											isInvalid={errors?.otp}
											isValid={dirtyFields?.otp && !errors?.otp}
											{...register('otp', {
												required: {
													value: showCodeInput,
													message: 'OTP is required',
												},
												validate: value =>
													value.length === 6 || 'OTP should be 6 characters',
											})}
											disabled={isSubmitting}
											readOnly={isSubmitting}
											placeholder='d'
										/>
									</FloatingLabel>
									<Form.Text className='text-danger'>
										{errors?.otp?.message}
									</Form.Text>
								</Form.Group>
							)}
							<Button
								variant={error ? 'danger' : 'primary'}
								onClick={() => error && window.location.reload()}
								type='submit'
								disabled={isSubmitting}
								className='mt-2 w-100'
							>
								{error
									? 'Reload Page'
									: showCodeInput
									? 'Verify OTP'
									: 'Send OTP'}
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Centered>
		</>
	);
}
