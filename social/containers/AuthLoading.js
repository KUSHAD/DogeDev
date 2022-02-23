import Head from 'next/head';
import Image from 'next/image';
import Centered from '../components/Centered';

export default function AuthLoading() {
	return (
		<>
			<Head>
				<title>DDSocial</title>
			</Head>
			<Centered>
				<div className='w-full flex justify-center'>
					<Image src='/logo192.png' width={192} height={192} />
				</div>
			</Centered>
		</>
	);
}
