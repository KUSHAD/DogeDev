import { addDoc } from 'firebase/firestore';
import Toast from 'react-native-simple-toast';
import { database } from '../firebase';

export function useQuestions() {
	async function addNewQuestion({ title, desc, user, attachment, subject }) {
		try {
			await addDoc(database.questionCol(), {
				title,
				desc,
				user,
				attachment,
				subject,
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}
	return { addNewQuestion };
}
