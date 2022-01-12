import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from './environment';
import { collection, getFirestore, doc } from 'firebase/firestore';

const app = initializeApp(environment.firebase);
export const firebaseAuth = getAuth(app);

export const firebaseFirestore = getFirestore(app);

export const database = {
  userID: id => {
    const dbCollection = collection(firebaseFirestore, 'user');
    return doc(dbCollection, id);
  },
};
