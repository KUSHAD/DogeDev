import Login from '../containers/Login';
import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';
import Home from '../containers/Home';

export default function HomePage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Home /> : <Login />;
}
