import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { colors, Icon, Badge } from 'react-native-elements';
import { useNotifications } from '../hooks/useNotifications';
import { useAuthProvider } from '../Providers/AuthProvider';
export default function NotificationButton({ navigation }) {
	const { authUser } = useAuthProvider();
	const { getUserUnreadNotifications, unreadNotifsNum } = useNotifications();
	useEffect(() => {
		async function get() {
			await getUserUnreadNotifications(authUser.uid);
		}
		get();
	}, [authUser]);
	function onPress() {
		navigation.navigate('Notification');
	}
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flexDirection: 'row',
			}}
		>
			<Icon name='notifications' color={colors.white} />
			<Badge
				onPress={onPress}
				containerStyle={{
					position: 'absolute',
					bottom: 0,
					right: -5,
				}}
				value={unreadNotifsNum}
				badgeStyle={{
					backgroundColor: colors.error,
				}}
			/>
		</TouchableOpacity>
	);
}
