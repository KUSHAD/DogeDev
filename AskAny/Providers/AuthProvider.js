import Toast from 'react-native-simple-toast';
import { createContext, useContext, useState } from 'react';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseAuth, database } from '../firebase';
import { useNotifications } from '../hooks/useNotifications';
import { environment } from '../environment';

const Auth = createContext();

export function AuthProvider({ children }) {
	const { registerForPushNotificationsAsync } = useNotifications();
	const [isLoading, setIsLoading] = useState(false);
	const [authUser, setAuthUser] = useState({
		email: '',
		name: '',
		avatar: '',
		uid: '',
		favSubs: [],
		pushToken: '',
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	async function login({ email, pass }) {
		try {
			setIsLoading(true);
			const user = await signInWithEmailAndPassword(firebaseAuth, email, pass);
			const dataInDB = await getDoc(database.userID(user.user.uid));
			setAuthUser({
				name: dataInDB.data().name,
				avatar: dataInDB.data().avatar,
				email: email,
				uid: user.user.uid,
				favSubs: dataInDB.data().favSubs,
				pushToken: dataInDB.data().pushToken,
			});
			setIsLoggedIn(true);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	async function signup({ email, pass, name, navigation }) {
		try {
			setIsLoading(true);
			const user = await createUserWithEmailAndPassword(
				firebaseAuth,
				email,
				pass
			);
			const pushToken = await registerForPushNotificationsAsync();
			await setDoc(database.userID(user.user.uid), {
				email,
				name,
				avatar: `https://res.cloudinary.com/kushad/image/upload/v1632819507/vhm1y9kojafqjpfnvmb9.png`,
				pushToken: pushToken,
				favSubs: environment.subjects,
			});
			setAuthUser({
				email,
				name,
				avatar: `https://res.cloudinary.com/kushad/image/upload/v1632819507/vhm1y9kojafqjpfnvmb9.png`,
				uid: user.user.uid,
				favSubs: environment.subjects,
				pushToken: pushToken,
			});
			setIsLoggedIn(true);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	function getUserLoginStatus() {
		setIsLoading(true);
		onAuthStateChanged(
			firebaseAuth,
			async user => {
				if (user) {
					const dataInDB = await getDoc(database.userID(user.uid));
					setAuthUser({
						name: dataInDB.data().name,
						avatar: dataInDB.data().avatar,
						email: user.email,
						uid: user.uid,
						favSubs: dataInDB.data().favSubs,
						pushToken: dataInDB.data().pushToken,
					});
					setIsLoggedIn(true);
					setIsLoading(false);
				} else {
					setIsLoggedIn(false);
					setIsLoading(false);
				}
			},
			error => {
				Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
				setIsLoading(false);
			}
		);
	}

	async function resetPass({ email }) {
		try {
			setIsLoading(true);
			await sendPasswordResetEmail(firebaseAuth, email);
			Toast.showWithGravity(
				`Password reset email sent pls check your inbox`,
				Toast.LONG,
				Toast.CENTER
			);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	async function setFavSubjects(subs, navigation) {
		try {
			setIsLoading(true);
			await updateDoc(database.userID(authUser.uid), {
				favSubs: subs,
			});
			setAuthUser({ ...authUser, favSubs: subs });
			navigation.navigate('MainTab');
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	const values = {
		login,
		isLoading,
		signup,
		authUser,
		isLoggedIn,
		getUserLoginStatus,
		resetPass,
		setFavSubjects,
	};

	return <Auth.Provider value={values}>{children}</Auth.Provider>;
}

export function useAuthProvider() {
	return useContext(Auth);
}
