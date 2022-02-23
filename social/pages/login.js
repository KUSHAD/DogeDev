import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';
import Login from '../containers/Login';

export default function LoginPage() {
	const { authLoading } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : <Login />;
}
