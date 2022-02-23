import Image from 'next/image';
export default function SmallAvatar({ src }) {
	return (
		src && <Image src={src} width={26} height={26} className='rounded-full' />
	);
}
