import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-elements';
import AnswerCard from '../../Components/AnswerCard';
import QuestionsCard from '../../Components/QuestionCard';
import { useAnswers } from '../../hooks/useAnswers';
import { useQuestions } from '../../hooks/useQuestions';

export default function ViewQuestion({ route, navigation }) {
	const { currentQuestion, getQuestion } = useQuestions();
	const { getAnswersQuestion, answers } = useAnswers();
	useEffect(() => {
		async function get() {
			await getQuestion(route.params.id);
			await getAnswersQuestion(route.params.id);
		}
		get();
	}, [route.params.id]);
	return (
		<>
			<ScrollView>
				<QuestionsCard
					question={{ ...currentQuestion, id: route.params.id }}
					navigation={navigation}
				/>
				{answers.length === 0 ? (
					<SafeAreaView style={{ flex: 1 }}>
						<Card>
							<Text
								h1
								h1Style={{
									textAlign: 'center',
									textDecorationLine: 'underline',
								}}
							>
								Sorry No on has answered the question till now
							</Text>
						</Card>
					</SafeAreaView>
				) : (
					<>
						<Text h4 style={{ marginTop: 10, textAlign: 'center' }}>
							{answers.length} Answers
						</Text>
						<FlatList
							initialNumToRender={10}
							data={answers}
							keyExtractor={item => item._id}
							renderItem={({ item }) => (
								<SafeAreaView style={{ flex: 0.5 }}>
									<AnswerCard answer={item} />
								</SafeAreaView>
							)}
						/>
					</>
				)}
			</ScrollView>
		</>
	);
}
