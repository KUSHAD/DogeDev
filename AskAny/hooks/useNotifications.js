import Toast from 'react-native-simple-toast';
import * as Notifications from 'expo-notifications';
import { environment } from '../environment';
import {
	addDoc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import { database } from '../firebase';
import { useState } from 'react';

export function useNotifications() {
	const [isLoading, setIsLoading] = useState(false);
	const [unreadNotifsNum, setUnreadNotifsNum] = useState(0);
	const [notifs, setNotifs] = useState([]);
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
				Toast.SHORT,
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
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		}
	}

	async function addNotification(targetUser, byUser, qTitle, qID) {
		try {
			await addDoc(database.notificationCol(), {
				targetUser,
				body: `${byUser} answered your question ${qTitle}`,
				createdAt: serverTimestamp(),
				status: environment.notificationStatus.unread,
				qTitle,
				qID,
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		}
	}

	async function getUserUnreadNotifications(_uid) {
		const q = query(
			database.notificationCol(),
			where('status', '==', environment.notificationStatus.unread),
			where('targetUser', '==', _uid)
		);

		onSnapshot(
			q,
			({ docs }) => {
				setUnreadNotifsNum(docs.length);
			},
			error => {
				Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
			}
		);
	}

	async function getUserNotification(_uid) {
		const q = query(
			database.notificationCol(),
			where('targetUser', '==', _uid),
			orderBy('createdAt', 'desc')
		);

		onSnapshot(
			q,
			({ docs }) => {
				const _docs = docs.map(_doc => {
					return {
						..._doc.data(),
						_id: _doc.id,
					};
				});
				setNotifs(_docs);
			},
			error => {
				Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
			}
		);
	}

	async function markAsRead(_id) {
		try {
			setIsLoading(true);
			await updateDoc(database.notificationID(_id), {
				status: environment.notificationStatus.read,
			});
			Toast.showWithGravity(
				`Notification is now marked read`,
				Toast.SHORT,
				Toast.CENTER
			);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	return {
		registerForPushNotificationsAsync,
		sendPushNotification,
		addNotification,
		getUserUnreadNotifications,
		unreadNotifsNum,
		getUserNotification,
		notifs,
		markAsRead,
		isLoading,
	};
}
