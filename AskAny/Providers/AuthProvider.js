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

const Auth = createContext();

export function AuthProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);
	const [authUser, setAuthUser] = useState({
		email: '',
		name: '',
		avatar: '',
		uid: '',
		favSubs: [],
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
			await setDoc(database.userID(user.user.uid), {
				email,
				name,
				avatar: `https://avatars.dicebear.com/api/jdenticon/${user.user.uid}.svg`,
			});
			setAuthUser({
				email,
				name,
				avatar: `https://avatars.dicebear.com/api/jdenticon/${user.user.uid}.svg`,
				uid: user.user.uid,
				favSubs: [],
			});
			navigation.navigate('FavSubjects');
			setIsLoggedIn(true);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	async function getUserLoginStatus() {
		setIsLoading(true);
		onAuthStateChanged(
			firebaseAuth,
			async user => {
				const dataInDB = await getDoc(database.userID(user.uid));
				setAuthUser({
					name: dataInDB.data().name,
					avatar: dataInDB.data().avatar,
					email: user.email,
					uid: user.uid,
					favSubs: dataInDB.data().favSubs,
				});
				setIsLoggedIn(true);
				setIsLoading(false);
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
