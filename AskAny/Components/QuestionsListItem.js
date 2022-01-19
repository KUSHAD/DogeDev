import { SafeAreaView, View } from 'react-native';
import { colors, ListItem, Text, Avatar } from 'react-native-elements';

export default function QuestionsListItem({ question }) {
	return (
		<ListItem bottomDivider topDivider>
			<ListItem.Content>
				<View style={{ flexDirection: 'row' }}>
					<Avatar source={{ uri: question.user.avatar }} size='small' />
					<SafeAreaView style={{ flexDirection: 'column' }}>
						<ListItem.Title>{question.user.name}</ListItem.Title>
						<ListItem.Subtitle>Subject :- {question.subject}</ListItem.Subtitle>
					</SafeAreaView>
				</View>
				<Text h3>
					{question.title.length < 30
						? question.title
						: question.desc.slice(0, 30) + '.....'}
				</Text>
				<Text h4 style={{ color: colors.grey3 }}>
					{question.desc.length < 60
						? question.desc
						: question.desc.slice(0, 60) + '.....'}
				</Text>
			</ListItem.Content>
		</ListItem>
	);
}
