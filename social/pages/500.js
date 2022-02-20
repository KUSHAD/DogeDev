import { Card, Typography, Button } from 'antd';
import Head from 'next/head';
import Centered from '../components/Centered';
import Image from 'next/image';
import Link from 'next/link';

export default function InternalErrorPage() {
	return (
		<>
			<Head>
				<title>Internal Error | DDSocial</title>
			</Head>
			<Centered>
				<Card className='text-center border-2'>
					<Typography className='text-2xl mb-2'>
						500 | Internal Error
					</Typography>
					<Image src='/500.svg' width={200} height={200} />
					<Typography className='mx-2 text-base text-gray-500'>
						We are facing some internal problems. Trying to fix it. It will
						start working soon.Try refreshing the page or go to the homepage
					</Typography>
					<Button
						type='primary'
						className='w-full'
						onClick={() => window?.location?.reload()}
					>
						Refresh page
					</Button>
					<Link href='/'>
						<Button type='link'>Back to home page</Button>
					</Link>
				</Card>
			</Centered>
		</>
	);
}
