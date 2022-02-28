import { Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
	return (
		<div className='hidden md:block mt-2'>
			<Link href='/'>
				<div className='flex flex-row cursor-pointer'>
					<Image src='/favicon.ico' width={50} height={50} />
					<Typography className='text-xl mt-2'>DDSocial</Typography>
				</div>
			</Link>
		</div>
	);
}
