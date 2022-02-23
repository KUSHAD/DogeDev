import { useSelector } from 'react-redux';
import Chats from '../containers/Chats';
import Login from '../containers/Login';
import AuthLoading from '../containers/AuthLoading';

export default function ChatsPage() {
	const { authLoading, auth } = useSelector(state => state);
	return authLoading ? <AuthLoading /> : auth.token ? <Chats /> : <Login />;
}
