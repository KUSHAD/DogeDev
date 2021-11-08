import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import constants from './constants';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, doc } from 'firebase/firestore';

const app = initializeApp(constants.FIREBASE);
getAnalytics(app);
export const firebaseAuth = getAuth(app);
export const firebaseFirestore = getFirestore(app);

export const database = {
	orderColl: () => collection(firebaseFirestore, 'restaurant-orders'),
	orderID: id => {
		const dbCollection = collection(firebaseFirestore, 'restaurant-orders');
		return doc(dbCollection, id);
	},
};
