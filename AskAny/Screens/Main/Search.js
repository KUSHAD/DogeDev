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
		console.log(searchQuestions);
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
				inputContainerStyle={{ backgroundColor: colors.grey5 }}
				containerStyle={{
					backgroundColor: colors.white,
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
