import { Route, Redirect } from 'react-router-dom';
import { useAuthProvider } from '../context/Auth';

export default function OwnerRoute(props) {
	const { user, isOwner } = useAuthProvider();
	return user && isOwner ? <Route {...props} /> : <Redirect to='/' />;
}
