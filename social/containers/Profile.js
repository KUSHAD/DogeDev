import Image from 'next/image';
import { useSelector } from 'react-redux';
import Info from '../components/Profile/Info';
import Posts from '../components/Profile/Posts';

export default function Profile({ user }) {
	const { profile } = useSelector(state => state);
	return (
		<>
			{profile.loading ? (
				<div className='flex w-full mt-2 justify-center'>
					<Image src='/loading.gif' width={100} height={100} />
				</div>
			) : (
				<Info user={user} />
			)}
			<Posts />
		</>
	);
}
