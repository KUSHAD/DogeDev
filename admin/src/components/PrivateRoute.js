import { Route, Redirect } from 'react-router-dom';
import { useAuthProvider } from '../contexts/Auth';

export default function PrivateRoute(props) {
	const { user } = useAuthProvider();
	return user ? <Route {...props} /> : <Redirect to='/auth' />;
}
