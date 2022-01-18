import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView, RefreshControl } from 'react-native';
import { colors, Text } from 'react-native-elements';
import Container from '../../Components/Container';
import QuestionsListItem from '../../Components/QuestionsListItem';
import { useQuestions } from '../../hooks/useQuestions';

export default function Home() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { userFavouredSubjectQuestions, questions } = useQuestions();
	useEffect(() => {
		async function getQuestions() {
			await userFavouredSubjectQuestions();
		}
		getQuestions();
	}, []);
	async function onRefresh() {
		setIsRefreshing(true);
		await userFavouredSubjectQuestions();
		setIsRefreshing(false);
	}
	return questions.length !== 0 ? (
		<FlatList
			initialNumToRender={10}
			onRefresh={onRefresh}
			refreshing={isRefreshing}
			refreshControl={
				<RefreshControl
					onRefresh={onRefresh}
					refreshing={isRefreshing}
					enabled
					colors={[
						colors.primary,
						colors.secondary,
						colors.success,
						colors.warning,
						colors.error,
					]}
				/>
			}
			data={questions}
			keyExtractor={item => item._id}
			renderItem={({ item }) => <QuestionsListItem question={item} />}
		/>
	) : (
		<Container>
			<SafeAreaView style={{ width: `80%` }}>
				<Text
					h2
					h2Style={{ textAlign: 'center', textDecorationLine: 'underline' }}
				>
					Sorry no existing questions present according to your preferred
					subject
				</Text>
			</SafeAreaView>
		</Container>
	);
}
