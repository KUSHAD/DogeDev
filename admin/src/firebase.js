import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import constants from './constants';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { collection, getFirestore, doc } from 'firebase/firestore/lite';

const app = initializeApp(constants.FIREBASE);
getAnalytics(app);
export const firebaseAuth = getAuth(app);
export const firebaseFirestore = getFirestore(app);
export const firebaseStorage = getStorage(app);

export const database = {
	att: id => {
		const dbCollection = collection(firebaseFirestore, 'admin-attendance');
		return doc(dbCollection, id);
	},
	docs: id => {
		const dbCollection = collection(firebaseFirestore, 'admin-exp-docs');
		return doc(dbCollection, id);
	},
	addDoc: id => {
		const dbCollection = collection(firebaseFirestore, 'admin-admission-docs');
		return doc(dbCollection, id);
	},
};
