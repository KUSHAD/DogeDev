import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import constants from './constants';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, doc } from 'firebase/firestore/lite';

const app = initializeApp(constants.FIREBASE);
getAnalytics(app);
export const firebaseAuth = getAuth(app);
export const firebaseFirestore = getFirestore(app);

export const database = {
	att: id => {
		const dbCollection = collection(firebaseFirestore, 'admin-attendance');
		return doc(dbCollection, id);
	},
};
