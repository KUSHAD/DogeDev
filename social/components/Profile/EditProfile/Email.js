import { Card, Button, Form, Steps, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EmailInput, OTPInput } from '../../FormControls';
import { useState } from 'react';
import {
	updateEmail,
	verifyEmail,
} from '../../../redux/actions/profile.action';
const { Step } = Steps;
const steps = ['Email', 'Verify Email'];

export default function Email() {
	const [current, setCurrent] = useState(0);

	return (
		<>
			<Steps current={current}>
				{steps.map(item => (
					<Step key={item} title={item} />
				))}
			</Steps>

			{current === 0 && <FormCont setCurrent={setCurrent} />}
			{current === 1 && <VerifyCont setCurrent={setCurrent} />}
		</>
	);
}

function FormCont({ setCurrent }) {
	const { auth, loading } = useSelector(state => state);
	const dispatch = useDispatch();
	function onFinish(data) {
		dispatch(updateEmail(data, auth, setCurrent));
	}

	return (
		<Card>
			<Form
				onFinish={onFinish}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{
					email: auth.tempEmail ? auth.tempEmail : auth.user.email,
				}}
			>
				<EmailInput />
				<Button
					loading={loading}
					className='w-full my-2'
					type='primary'
					htmlType='submit'
				>
					{auth.OTPToken ? 'Change Email' : 'Update Email'}
				</Button>
				{auth.OTPToken && (
					<Button className='w-full' onClick={() => setCurrent(1)}>
						Cancel
					</Button>
				)}
			</Form>
		</Card>
	);
}

function VerifyCont({ setCurrent }) {
	const { loading, auth } = useSelector(state => state);
	const dispatch = useDispatch();

	function goBack() {
		setCurrent(0);
	}

	function resend() {
		dispatch(updateEmail({ email: auth.tempEmail }, auth, setCurrent));
	}

	function onSubmit({ otp }) {
		dispatch(verifyEmail({ otp, OTPToken: auth.OTPToken }, auth, setCurrent));
	}

	return (
		<Form
			onFinish={onSubmit}
			name='basic'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{ otp: '' }}
		>
			<Typography>Enter the OTP received in your inbox</Typography>
			<OTPInput />
			<Button
				loading={loading}
				type='primary'
				className='my-2 w-full'
				htmlType='submit'
			>
				Verify
			</Button>
			<Button onClick={resend} loading={loading} className='w-full'>
				Resend Email
			</Button>
			<Button
				onClick={goBack}
				className=' my-2 w-full'
				loading={loading}
				danger
			>
				Change Credentials
			</Button>
		</Form>
	);
}
