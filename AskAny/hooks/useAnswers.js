import {
	addDoc,
	serverTimestamp,
	onSnapshot,
	query,
	where,
	orderBy,
} from 'firebase/firestore';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { database } from '../firebase';

export function useAnswers() {
	const [answers, setAnswers] = useState([]);
	async function newAnswer({ text, attachment, user, questionID }) {
		try {
			await addDoc(database.answerCol(), {
				text,
				attachment,
				user,
				questionID,
				createdAt: serverTimestamp(),
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function getAnswersQuestion(_id) {
		const q = query(
			database.answerCol(),
			where('questionID', '==', _id),
			orderBy('createdAt', 'desc')
		);
		onSnapshot(
			q,
			({ docs }) => {
				const _answers = docs.map(_doc => {
					return {
						..._doc.data(),
						_id: _doc.id,
					};
				});
				setAnswers(_answers);
			},
			error => {
				Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
			}
		);
	}

	return { newAnswer, getAnswersQuestion, answers };
}
