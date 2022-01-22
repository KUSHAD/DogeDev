import { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Card, Text, colors } from 'react-native-elements';
import Container from '../../Components/Container';
import { useQuestions } from '../../hooks/useQuestions';
import QuestionListItem from '../../Components/QuestionsListItem';

export default function MyQuestions({ navigation }) {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { getUserQuestions, myQuestions } = useQuestions();
	useEffect(() => {
		getUserQuestions();
	}, []);

	async function onRefresh() {
		setIsRefreshing(true);
		await getUserQuestions();
		setIsRefreshing(false);
	}

	return myQuestions.length === 0 ? (
		<Container>
			<Card>
				<Text
					h2
					h2Style={{ textAlign: 'center', textDecorationLine: 'underline' }}
				>
					Sorry you don't have any questions to see here
				</Text>
			</Card>
		</Container>
	) : (
		<FlatList
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
			data={myQuestions}
			keyExtractor={item => item._id}
			initialNumToRender={10}
			renderItem={({ item }) => (
				<QuestionListItem question={item} navigation={navigation} />
			)}
		/>
	);
}
