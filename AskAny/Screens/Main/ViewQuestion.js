import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import QuestionsCard from '../../Components/QuestionCard';
import { useQuestions } from '../../hooks/useQuestions';

export default function ViewQuestion({ route, navigation }) {
	const { currentQuestion, getQuestion } = useQuestions();
	useEffect(() => {
		async function get() {
			await getQuestion(route.params.id);
		}
		get();
	}, []);
	return (
		<>
			<ScrollView>
				<QuestionsCard
					question={{ ...currentQuestion, id: route.params.id }}
					navigation={navigation}
				/>
			</ScrollView>
		</>
	);
}
