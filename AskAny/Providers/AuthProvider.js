import Toast from 'react-native-simple-toast';
import { createContext, useContext, useEffect, useState } from 'react';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signOut,
	updatePassword,
	updateEmail as authUpdateEmail,
} from 'firebase/auth';
import { setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseAuth, database } from '../firebase';
import { useNotifications } from '../hooks/useNotifications';
import { environment } from '../environment';
import Container from '../Components/Container';
import { colors } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';

const Auth = createContext();

export function AuthProvider({ children }) {
	const { registerForPushNotificationsAsync } = useNotifications();
	const [isLoading, setIsLoading] = useState(false);
	const [authLoading, setAuthLoading] = useState(true);
	const [firebaseUser, setFirebaseUser] = useState();
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

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			firebaseAuth,
			async user => {
				if (user) {
					setFirebaseUser(user);
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
					setAuthLoading(false);
				} else {
					setIsLoggedIn(false);
					setAuthLoading(false);
				}
			},
			error => {
				Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
				setAuthLoading(false);
			}
		);
		return unsubscribe();
	}, []);

	async function logout() {
		try {
			setIsLoading(true);
			setAuthUser({});
			await signOut(firebaseAuth);
			setIsLoggedIn(false);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	async function updateName({ name }) {
		try {
			await updateDoc(database.userID(authUser.uid), {
				name: name,
			});
			setAuthUser({ ...authUser, name: name });
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function updatePass({ pass }) {
		try {
			await updatePassword(firebaseUser, pass);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function updateEmail({ email }) {
		try {
			await authUpdateEmail(firebaseUser, email);
			await updateDoc(database.userID(authUser.uid), {
				email: email,
			});
			setAuthUser({ ...authUser, email: email });
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	const values = {
		login,
		isLoading,
		signup,
		authUser,
		isLoggedIn,
		resetPass,
		setFavSubjects,
		logout,
		updatePass,
		updateEmail,
		updateName,
	};

	return (
		<Auth.Provider value={values}>
			{authLoading ? (
				<Container>
					<ActivityIndicator color={colors.primary} size='large' />
				</Container>
			) : (
				children
			)}
		</Auth.Provider>
	);
}

export function useAuthProvider() {
	return useContext(Auth);
}
