import { useSelector } from 'react-redux';
import AuthLoading from '../containers/AuthLoading';
import Explore from '../containers/Explore';
import Login from '../containers/Login';

export default function ExplorePage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Explore /> : <Login />;
}