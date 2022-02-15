import { useState } from 'react';
import QuestionListItem from '../../Components/QuestionsListItem';
import { FlatList } from 'react-native';
import { colors, SearchBar } from 'react-native-elements';
import { useQuestions } from '../../hooks/useQuestions';
export default function Search({ navigation }) {
	const [searchString, setSearchString] = useState('');
	const { searchQuestion, searchQuestions } = useQuestions();

	async function search(text) {
		await searchQuestion(text);
	}

	return (
		<>
			<SearchBar
				value={searchString}
				defaultValue={searchString}
				onChangeText={text => {
					setSearchString(text);
					search(text);
				}}
				platform='default'
				inputStyle={{ backgroundColor: colors.white }}
				inputContainerStyle={{ backgroundColor: colors.white }}
				containerStyle={{
					backgroundColor: colors.primary,
					borderBottomColor: colors.primary,
					borderTopColor: colors.primary,
				}}
			/>
			<FlatList
				data={searchQuestions}
				keyExtractor={item => item._id}
				initialNumToRender={10}
				renderItem={({ item }) => (
					<QuestionListItem navigation={navigation} question={item} />
				)}
			/>
		</>
	);
}
