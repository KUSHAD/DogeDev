import { useSelector } from 'react-redux';
import Profile from '../../containers/Profile';
import AuthLoading from '../../containers/AuthLoading';

export default function ProfilePage() {
	const { authLoading } = useSelector(state => state);

	return authLoading ? <AuthLoading /> : <Profile />;
}
