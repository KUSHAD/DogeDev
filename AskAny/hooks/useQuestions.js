import {
	addDoc,
	onSnapshot,
	query,
	where,
	orderBy,
	serverTimestamp,
} from 'firebase/firestore';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { database } from '../firebase';
import { useAuthProvider } from '../Providers/AuthProvider';

export function useQuestions() {
	const [questions, setQuestions] = useState([]);
	const { authUser } = useAuthProvider();
	async function addNewQuestion({ title, desc, user, attachment, subject }) {
		try {
			await addDoc(database.questionCol(), {
				title,
				desc,
				user,
				attachment,
				subject,
				createdAt: serverTimestamp(),
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function userFavouredSubjectQuestions() {
		const q = query(database.questionCol(), orderBy('createdAt', 'desc'));
		onSnapshot(
			q,
			({ docs }) => {
				const _questions = docs
					.filter(_q => authUser.favSubs.includes(_q.data().subject))
					.map(_q => {
						return {
							..._q.data(),
							_id: _q.id,
						};
					});
				setQuestions(_questions);
			},
			error => Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER)
		);
	}

	return { addNewQuestion, questions, userFavouredSubjectQuestions };
}
