import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Image } from 'react-native';
import { colors, Text, Card, Button } from 'react-native-elements';
import ImageModal from './ImageModal';

export default function QuestionsCard({ question, navigation }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Card>
				<Text>{question.user.name}</Text>
				<Text>Subject :- {question.subject}</Text>
				<Text h3>{question.title}</Text>
				<Text h4 style={{ color: colors.grey3 }}>
					{question.desc}
				</Text>
				{Boolean(question.attachment) && (
					<>
						<Text h4>Image</Text>
						<TouchableOpacity onPress={() => setIsOpen(true)}>
							<Image
								source={{ uri: question.attachment }}
								style={{ aspectRatio: 1 / 1, width: `80%` }}
							/>
						</TouchableOpacity>
					</>
				)}
				{Boolean(navigation) && (
					<View style={{ marginTop: 10, width: `50%`, marginStart: `50%` }}>
						<Button
							title='Answer this'
							raised
							onPress={() =>
								navigation.navigate('Answer', {
									question: { ...question, _id: question.id },
								})
							}
						/>
					</View>
				)}
			</Card>
			<ImageModal
				imgUri={question.attachment || ''}
				isOpen={isOpen}
				onDismiss={() => setIsOpen(false)}
			/>
		</>
	);
}
