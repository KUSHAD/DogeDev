import Signup from '../containers/Signup';
import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';
import Home from '../containers/Home';

export default function SignupPage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Home /> : <Signup />;
}
