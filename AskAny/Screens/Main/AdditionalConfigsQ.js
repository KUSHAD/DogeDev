import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, Image } from 'react-native';
import {
	Button,
	Text,
	BottomSheet,
	ListItem,
	colors,
} from 'react-native-elements';
import Container from '../../Components/Container';
import { environment } from '../../environment';
import { useAttachments } from '../../hooks/useAttachments';
import { useQuestions } from '../../hooks/useQuestions';
import { useAuthProvider } from '../../Providers/AuthProvider';

import ImageModal from '../../Components/ImageModal';
import Toast from 'react-native-simple-toast';

export default function AdditionalConfigsQ({ route, navigation }) {
	const [subject, setSubject] = useState('');
	const [subjectSheet, setSubjectSheet] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const {
		attachmentSrc,
		pickImageFromGallery,
		removeAttachment,
		uploadAttachment,
	} = useAttachments();

	const { authUser } = useAuthProvider();

	const { title, desc } = route.params;

	const { addNewQuestion } = useQuestions();

	async function newQuestion() {
		try {
			setIsLoading(true);
			const imgUrl = await uploadAttachment();

			await addNewQuestion({
				title: title,
				desc: desc,
				attachment: imgUrl || '',
				user: {
					email: authUser.email,
					name: authUser.name,
					avatar: authUser.avatar,
				},
				subject: subject,
			});
			navigation.popToTop();
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		return () => {
			setIsLoading(false);
			setSubject('');
			removeAttachment();
		};
	}, []);

	return (
		<>
			<Container>
				<SafeAreaView style={{ width: `80%` }}>
					<Button
						loading={isLoading}
						title='Select a subject'
						raised
						onPress={() => {
							setSubjectSheet(true);
						}}
					/>
					<Text>Selected Subject :- {subject || 'No subject selected'}</Text>
					<BottomSheet isVisible={subjectSheet}>
						{environment.subjects.map(sub => (
							<ListItem
								key={sub}
								onPress={() => {
									setSubject(sub);
									setSubjectSheet(false);
								}}
							>
								<ListItem.Title>{sub}</ListItem.Title>
								<ListItem.CheckBox checked={sub === subject} />
							</ListItem>
						))}
					</BottomSheet>
					<Button
						loading={isLoading}
						title={attachmentSrc ? 'Change Attachment' : 'Add Attachment'}
						raised
						onPress={() => pickImageFromGallery()}
					/>
					{Boolean(attachmentSrc) && (
						<>
							<TouchableOpacity
								style={{ marginTop: 10 }}
								onPress={() => setModal(true)}
								onLongPress={() => pickImageFromGallery()}
							>
								<Image
									source={{ uri: attachmentSrc }}
									style={{ width: `100%`, aspectRatio: 1 / 1 }}
								/>
							</TouchableOpacity>
							<Button
								loading={isLoading}
								onPress={removeAttachment}
								type='outline'
								buttonStyle={{ borderColor: colors.error }}
								titleStyle={{ color: colors.error }}
								title='Remove Attachment'
								containerStyle={{ marginTop: 10 }}
							/>
						</>
					)}
				</SafeAreaView>
			</Container>
			{Boolean(subject) && (
				<Button
					title='Add Question'
					onPress={newQuestion}
					loading={isLoading}
				/>
			)}
			<ImageModal
				imgUri={attachmentSrc}
				isOpen={modal}
				onDismiss={() => setModal(false)}
			/>
		</>
	);
}
