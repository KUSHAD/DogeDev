import { useSelector } from 'react-redux';
import Profile from '../../containers/Profile';
import AuthLoading from '../../containers/AuthLoading';
import Login from '../../containers/Login';

export default function ProfilePage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Profile /> : <Login />;
}
