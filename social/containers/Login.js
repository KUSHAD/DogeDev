import { Button, Card, Form, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import Centered from '../components/Centered';

export default function Login() {
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
					<Form>
						<Typography>
							Need an account ?{' '}
							<Link href='/signup'>
								<Button type='link'>Signup</Button>
							</Link>
						</Typography>
					</Form>
				</Card>
			</Centered>
		</>
	);
}
