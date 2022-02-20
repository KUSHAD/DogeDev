import Centered from '../components/Centered';
import Head from 'next/head';
import { Button, Card, Form, Steps } from 'antd';
import {
	ConfPassInput,
	EmailInput,
	NameInput,
	OTPInput,
	PassInput,
	UsernameInput,
} from '../components/FormControls';
import { useState } from 'react';

const { Step } = Steps;

const steps = ['Signup', 'Verify', 'Save Info'];

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
					{current === 0 && <FormCont setCurrent={setCurrent} />}
					{current === 1 && <VerifyCont setCurrent={setCurrent} />}
					{current === 2 && <SaveInfo setCurrent={setCurrent} />}
				</Card>
			</Centered>
		</>
	);
}

function FormCont({ setCurrent }) {
	const { useForm } = Form;
	const formRef = useForm();
	function onSubmit(values) {
		console.log(values);
		setCurrent(1);
	}
	return (
		<Form
			ref={formRef}
			onFinish={onSubmit}
			name='basic'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{ name: '', email: '', password: '', confPass: '' }}
		>
			<NameInput />
			<EmailInput />
			<UsernameInput />
			<PassInput />
			<ConfPassInput _ref={formRef} />
			<Button type='primary' className='my-2 w-full' htmlType='submit'>
				Signup
			</Button>
		</Form>
	);
}

function VerifyCont({ setCurrent }) {
	return (
		<Form
			name='basic'
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{ otp: '' }}
		>
			<OTPInput />
			<Button type='primary' className='my-2 w-full' htmlType='submit'>
				Signup
			</Button>
		</Form>
	);
}

function SaveInfo() {
	return 'UwU';
}
