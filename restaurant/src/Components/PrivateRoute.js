import { Route, Redirect } from 'react-router-dom';
import { useAuthProvider } from '../context/Auth';

export default function PrivateRoute(props) {
	const { user } = useAuthProvider();
	return user ? <Route {...props} /> : <Redirect to='/' />;
}
