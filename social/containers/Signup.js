import Centered from '../components/Centered';
import Head from 'next/head';
import { Button, Card, Form, Steps, Typography, Statistic } from 'antd';
import {
	ConfPassInput,
	EmailInput,
	NameInput,
	OTPInput,
	PassInput,
	RememberMeCheckBox,
	UsernameInput,
} from '../components/FormControls';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyOTP } from '../redux/actions/auth.actions';
import Link from 'next/link';

const { Step } = Steps;
const { Countdown } = Statistic;

const steps = ['Signup', 'Verify Email'];

export default function Signup() {
	const [current, setCurrent] = useState(0);

	return (
		<>
			<Head>
				<title>Signup | DDSocial</title>
			</Head>
			<Centered>
				<Steps current={current}>
					{steps.map(item => (
						<Step key={item} title={item} />
					))}
				</Steps>
				<Card>
					<Typography className='text-2xl m-2 text-center underline'>
						Signup
					</Typography>
					{current === 0 && <FormCont setCurrent={setCurrent} />}
					{current === 1 && <VerifyCont setCurrent={setCurrent} />}
				</Card>
			</Centered>
		</>
	);
}

function FormCont({ setCurrent }) {
	const { useForm } = Form;
	const { loading, auth } = useSelector(state => state);
	const dispatch = useDispatch();
	const formRef = useForm();
	function onSubmit(data) {
		dispatch(signup(data, setCurrent));
	}
	return (
		<Form
			ref={formRef}
			onFinish={onSubmit}
			name='basic'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{
				name: auth.name || '',
				email: auth.email || '',
				password: auth.password || '',
				confPass: auth.password || '',
				remember: auth.remember || true,
				username: auth.username || '',
			}}
		>
			<NameInput />
			<EmailInput />
			<UsernameInput />
			<PassInput />
			<ConfPassInput _ref={formRef} />
			<RememberMeCheckBox />
			<Button
				type='primary'
				loading={loading}
				className='my-2 w-full'
				htmlType='submit'
			>
				{auth.OTPToken ? 'Update Credentials' : 'Signup'}
			</Button>
			{auth.OTPToken && (
				<Button className='w-full' onClick={() => setCurrent(1)}>
					Cancel
				</Button>
			)}
			<Typography>
				Already have an account ?
				<Link href='/login'>
					<Button type='link'>Login</Button>
				</Link>
			</Typography>
		</Form>
	);
}

const minutesToAdd = 10;
const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

function VerifyCont({ setCurrent }) {
	const [counter, setCounter] = useState(futureDate);

	const { loading, auth } = useSelector(state => state);
	const dispatch = useDispatch();

	function goBack() {
		setCurrent(0);
	}

	function resend() {
		dispatch(signup(auth), setCurrent).then(() => {
			const _minutesToAdd = 10;
			const _currentDate = new Date();
			const _futureDate = new Date(
				_currentDate.getTime() + _minutesToAdd * 60000
			);

			setCounter(_futureDate);
		});
	}

	function onSubmit({ otp }) {
		dispatch(verifyOTP({ otp, OTPToken: auth.OTPToken }, setCurrent));
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
			<Countdown value={counter} className='text-center text-sm' />
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
