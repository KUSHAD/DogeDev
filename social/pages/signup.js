import Signup from '../containers/Auth/Signup';
import { useSelector } from 'react-redux';
import AuthLoading from '../containers/Auth/AuthLoading';
import Home from '../containers/Home';

export default function SignupPage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Home /> : <Signup />;
}
