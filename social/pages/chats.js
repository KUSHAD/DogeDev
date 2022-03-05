import { useSelector } from 'react-redux';
import Chats from '../containers/Chats/Chats';
import Login from '../containers/Auth/Login';
import AuthLoading from '../containers/Auth/AuthLoading';

export default function ChatsPage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Chats /> : <Login />;
}
