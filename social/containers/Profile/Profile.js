import { useSelector } from 'react-redux';
import InfoLoading from '../../components/Profile/InfoLoading';
import Info from '../../components/Profile/Info';
import Posts from '../../components/Profile/Posts';

export default function Profile() {
	const { profile } = useSelector(state => state);
	return (
		<>
			{profile.loading ? <InfoLoading /> : <Info />}
			<Posts />
		</>
	);
}
