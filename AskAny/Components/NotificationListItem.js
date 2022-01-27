import { colors, ListItem, Icon, Button } from 'react-native-elements';
import { environment } from '../environment';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationListItem({ notification, navigation }) {
	return (
		<ListItem topDivider bottomDivider>
			<ListItem.Swipeable
				rightContent={
					<RightContent
						navigation={navigation}
						notification={notification}
						_id={notification._id}
						disabled={Boolean(
							notification.status === environment.notificationStatus.read
						)}
					/>
				}
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

function RightContent({ _id, disabled, notification, navigation }) {
	const { markAsRead, isLoading } = useNotifications();

	return disabled ? (
		<Button
			icon={<Icon name='visibility' color={colors.white} />}
			buttonStyle={{ minHeight: '100%', backgroundColor: colors.primary }}
			title='View Question'
			onPress={() => {
				navigation.navigate('ViewQuestion', {
					title:
						notification.qTitle.length < 30
							? notification.qTitle
							: notification.qTitle.slice(0, 30) + '.....',
					id: notification.qID,
				});
			}}
		/>
	) : (
		<Button
			loading={isLoading}
			icon={<Icon name='mark-chat-read' color={colors.white} />}
			title='Mark as read'
			buttonStyle={{ minHeight: '100%', backgroundColor: colors.success }}
			onPress={() => markAsRead(_id)}
		/>
	);
}
