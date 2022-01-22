import { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Card, Text, ListItem, colors } from 'react-native-elements';
import ImageModal from './ImageModal';

export default function AnswerCard({ answer }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Card>
				<ListItem.Title>{answer.user}</ListItem.Title>
				<Text h4 h4Style={{ color: colors.grey3 }}>
					{answer.text}
				</Text>
				{Boolean(answer.attachment) && (
					<>
						<Text h4>Image</Text>
						<TouchableOpacity onPress={() => setIsOpen(true)}>
							<Image
								source={{ uri: answer.attachment }}
								style={{ aspectRatio: 1 / 1, width: `80%` }}
							/>
						</TouchableOpacity>
					</>
				)}
			</Card>
			<ImageModal
				imgUri={answer.attachment || ''}
				onDismiss={() => setIsOpen(false)}
				isOpen={isOpen}
			/>
		</>
	);
}
