import Toast from 'react-native-simple-toast';
import * as Notifications from 'expo-notifications';
import { environment } from '../environment';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { database } from '../firebase';

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

	async function sendPushNotification(token, text, authUser) {
		try {
			const body = {
				to: token,
				title: `${authUser.name} answered your question`,
				body: text.length < 30 ? text : text.slice(0, 30) + '.....',
			};
			await fetch(environment.pusNotifEndpoint, {
				headers: {
					Accept: 'application/json',
					'Accept-Encoding': 'gzip, deflate',
					'Content-Type': 'application/json',
					host: 'expo.host',
				},
				method: 'POST',
				body: JSON.stringify(body),
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function addNotification(targetUser, byUser, qTitle) {
		try {
			await addDoc(database.notificationCol(), {
				targetUser,
				body: `${byUser} answered your question ${qTitle}`,
				createdAt: serverTimestamp(),
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	return {
		registerForPushNotificationsAsync,
		sendPushNotification,
		addNotification,
	};
}
