import { colors, ListItem, Text, Icon, Button } from 'react-native-elements';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationListItem({ notification }) {
	return (
		<ListItem>
			<ListItem.Swipeable
				rightContent={<RightContent _id={notification._id} />}
				containerStyle={{
					flexDirection: 'column',
				}}
			>
				<ListItem.Title>{notification.body}</ListItem.Title>
				<ListItem.Subtitle style={{ color: colors.grey3 }}>
					Status :- {notification.status}
				</ListItem.Subtitle>
			</ListItem.Swipeable>
		</ListItem>
	);
}

function RightContent({ _id }) {
	const { markAsRead, isLoading } = useNotifications();

	return (
		<Button
			loading={isLoading}
			icon={<Icon name='mark-chat-read' color={colors.white} />}
			title='Mark as read'
			buttonStyle={{ minHeight: '100%', backgroundColor: colors.success }}
			onPress={() => markAsRead(_id)}
		/>
	);
}
