import Image from 'next/image';
export default function MediumAvatar({ src }) {
	return (
		src && <Image src={src} width={50} height={50} className='rounded-full' />
	);
}
