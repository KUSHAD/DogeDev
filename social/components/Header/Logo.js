import { Typography } from 'antd';
import Image from 'next/image';

export default function Logo() {
	return (
		<div className='hidden md:block mt-2'>
			<div className='flex flex-row'>
				<Image src='/favicon.ico' width={50} height={50} />
				<Typography className='text-xl mt-2'>DDSocial</Typography>
			</div>
		</div>
	);
}
