import { Card, Typography, Button } from 'antd';
import Head from 'next/head';
import Centered from '../components/Centered';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
	return (
		<>
			<Head>
				<title>Page Not Found | DDSocial</title>
			</Head>
			<Centered>
				<Card className='text-center border-2'>
					<Typography className='text-2xl mb-2'>
						404 | Page Not Found
					</Typography>
					<Image src='/404.svg' width={200} height={200} />
					<Typography className='mx-2 text-base text-gray-500'>
						Link you have entered is maybe broken or moved to some new page
					</Typography>
					<Link href='/'>
						<Button type='link'>Back to home page</Button>
					</Link>
				</Card>
			</Centered>
		</>
	);
}
