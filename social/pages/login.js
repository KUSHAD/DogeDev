import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';
import Login from '../containers/Login';
import Home from '../containers/Home';

export default function LoginPage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Home /> : <Login />;
}
