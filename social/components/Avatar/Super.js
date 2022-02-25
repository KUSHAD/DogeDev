import Image from 'next/image';
export default function SuperAvatar({ src }) {
	return (
		src && <Image src={src} width={150} height={150} className='rounded-full' />
	);
}
