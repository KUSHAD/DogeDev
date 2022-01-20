import { addDoc } from 'firebase/firestore';
import Toast from 'react-native-simple-toast';
import { database } from '../firebase';

export function useAnswers() {
	async function newAnswer({ text, attachment, user, questionID }) {
		try {
			await addDoc(database.answerCol(), {
				text,
				attachment,
				user,
				questionID,
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}
	return { newAnswer };
}
