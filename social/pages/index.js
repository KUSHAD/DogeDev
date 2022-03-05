import Login from '../containers/Auth/Login';
import { useSelector } from 'react-redux';
import AuthLoading from '../containers/Auth/AuthLoading';
import Home from '../containers/Home';

export default function HomePage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Home /> : <Login />;
}
