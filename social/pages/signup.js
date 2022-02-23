import Signup from '../containers/Signup';
import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';

export default function SignupPage() {
	const { authLoading } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : <Signup />;
}
