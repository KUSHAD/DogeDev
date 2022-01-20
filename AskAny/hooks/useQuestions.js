import {
	addDoc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
	getDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { database } from '../firebase';
import { useAuthProvider } from '../Providers/AuthProvider';

export function useQuestions() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setQuestion] = useState({
		title: '',
		desc: '',
		attachment: '',
		user: {
			name: '',
			uid: '',
			avatar: '',
			pushToken:''
		},
		subject: '',
	});
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

	async function getQuestion(_id) {
		try {
			const _question = await getDoc(database.questionID(_id));
			setQuestion({
				title: _question.data().title,
				desc: _question.data().desc,
				attachment: _question.data().attachment,
				user: {
					avatar: _question.data().user.avatar,
					name: _question.data().user.name,
					uid: _question.data().user.uid,
					pushToken: _question.data().user.pushToken,
				},
				subject: _question.data().subject,
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	return {
		addNewQuestion,
		questions,
		userFavouredSubjectQuestions,
		currentQuestion,
		getQuestion,
	};
}
