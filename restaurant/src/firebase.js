import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import constants from './constants';
import { getAuth } from 'firebase/auth';

const app = initializeApp(constants.FIREBASE);
getAnalytics(app);
export const firebaseAuth = getAuth(app);
