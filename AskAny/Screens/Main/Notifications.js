import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import Container from '../../Components/Container';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuthProvider } from '../../Providers/AuthProvider';
import NotificationListItem from '../../Components/NotificationListItem';

export default function Notifications({ navigation }) {
	const { authUser } = useAuthProvider();
	const { getUserNotification, notifs } = useNotifications();
	useEffect(() => {
		async function get() {
			await getUserNotification(authUser.uid);
		}
		get();
	}, []);
	return notifs.length === 0 ? (
		<Container>
			<Card containerStyle={{ width: `80%` }}>
				<Card.Title h1>Sorry You don't have notifications to see</Card.Title>
			</Card>
		</Container>
	) : (
		<FlatList
			data={notifs}
			keyExtractor={item => item._id}
			initialNumToRender={10}
			renderItem={({ item }) => (
				<NotificationListItem notification={item} navigation={navigation} />
			)}
		/>
	);
}
