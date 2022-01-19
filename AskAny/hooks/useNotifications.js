import Toast from 'react-native-simple-toast';
import * as Notifications from 'expo-notifications';

export function useNotifications() {
	async function registerForPushNotificationsAsync() {
		let token;
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			Toast.showWithGravity(
				'Failed to get push token for push notification!',
				Toast.LONG,
				Toast.CENTER
			);
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		return token;
	}

	return { registerForPushNotificationsAsync };
}
