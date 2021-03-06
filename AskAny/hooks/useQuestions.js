import {
	addDoc,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
	getDoc,
	where,
	updateDoc,
	limit,
} from 'firebase/firestore';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { environment } from '../environment';
import { database } from '../firebase';
import { useAuthProvider } from '../Providers/AuthProvider';

export function useQuestions() {
	const [questions, setQuestions] = useState([]);
	const [myQuestions, setMyQuestions] = useState([]);
	const [searchQuestions, setSearchQuestions] = useState([]);
	const [currentQuestion, setQuestion] = useState({
		title: '',
		desc: '',
		attachment: '',
		user: {
			name: '',
			uid: '',
			avatar: '',
			pushToken: '',
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
				status: environment.questionStats.unanswered,
			});
			Toast.showWithGravity(`Added your question`, Toast.SHORT, Toast.CENTER);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		}
	}

	async function userFavouredSubjectQuestions() {
		const q = query(
			database.questionCol(),
			where('status', '==', environment.questionStats.unanswered),
			orderBy('createdAt', 'desc')
		);
		onSnapshot(
			q,
			({ docs }) => {
				const _questions = docs
					.filter(
						_q =>
							authUser.favSubs.includes(_q.data().subject) ||
							_q.data().user.uid === authUser.uid
					)
					.map(_q => {
						return {
							..._q.data(),
							_id: _q.id,
						};
					});
				setQuestions(_questions);
			},
			error => Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER)
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
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		}
	}

	async function markQuestionAnswered(_id) {
		try {
			await updateDoc(database.questionID(_id), {
				status: environment.questionStats.answered,
			});
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		}
	}

	async function getUserQuestions() {
		const q = query(
			database.questionCol(),
			where('user.uid', '==', authUser.uid),
			orderBy('createdAt', 'desc')
		);

		onSnapshot(
			q,
			({ docs }) => {
				const _myQuestions = docs.map(_doc => {
					return {
						..._doc.data(),
						_id: _doc.id,
					};
				});
				setMyQuestions(_myQuestions);
			},
			error => {
				Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
			}
		);
	}

	async function searchQuestion(_searchString) {
		if (!_searchString) {
			setSearchQuestions([]);
			return;
		}
		const q = query(
			database.questionCol(),
			where('title', '>=', _searchString),
			limit(10)
		);
		onSnapshot(
			q,
			({ docs }) => {
				const _docs = docs.map(_doc => {
					return {
						..._doc.data(),
						_id: _doc.id,
					};
				});
				setSearchQuestions(_docs);
			},
			error => {
				Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
				console.log(error);
			}
		);
	}

	return {
		addNewQuestion,
		questions,
		userFavouredSubjectQuestions,
		currentQuestion,
		getQuestion,
		markQuestionAnswered,
		myQuestions,
		getUserQuestions,
		searchQuestion,
		searchQuestions,
	};
}
