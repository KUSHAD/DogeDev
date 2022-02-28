import { Button, Card, Form, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Centered from '../components/Centered';
import {
	EmailUserNameInput,
	PassInput,
	RememberMeCheckBox,
} from '../components/FormControls';
import { login } from '../redux/actions/auth.actions';
import { useRouter } from 'next/router';

export default function Login() {
	const { loading } = useSelector(state => state);
	const dispatch = useDispatch();
	const router = useRouter();
	function onSubmit(data) {
		dispatch(login(data, router));
	}
	return (
		<>
			<Head>
				<title>Login | DDSocial</title>
			</Head>
			<Centered>
				<Card>
					<Typography className='text-2xl m-2 text-center underline'>
						Login
					</Typography>
					<Form
						onFinish={onSubmit}
						name='basic'
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={{
							identity: '',
							password: '',
							remember: true,
						}}
					>
						<EmailUserNameInput />
						<PassInput />
						<RememberMeCheckBox />
						<Button
							loading={loading}
							type='primary'
							className='w-full'
							htmlType='submit'
						>
							Login
						</Button>
						<Typography>
							Need an account ?{' '}
							<Link
								href={
									router.query.next
										? `/signup?next=${router.query.next}`
										: '/signup'
								}
							>
								<Button type='link'>Signup</Button>
							</Link>
						</Typography>
					</Form>
				</Card>
			</Centered>
		</>
	);
}
