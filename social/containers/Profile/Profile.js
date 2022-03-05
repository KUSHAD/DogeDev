import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import Info from '../../components/Profile/Info';
import Posts from '../../components/Profile/Posts';

export default function Profile() {
	const { profile } = useSelector(state => state);
	return (
		<>
			{profile.loading ? (
				<div className='flex w-full mt-8 justify-center'>
					<Loading />
				</div>
			) : (
				<Info />
			)}
			<Posts />
		</>
	);
}
