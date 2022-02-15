import { Card, Button, colors } from 'react-native-elements';
import Container from '../../Components/Container';
import { Image, TouchableOpacity } from 'react-native';
import { useAttachments } from '../../hooks/useAttachments';
import { useState } from 'react';
import ImageModal from '../../Components/ImageModal';
import Toast from 'react-native-simple-toast';
import { useAuthProvider } from '../../Providers/AuthProvider';
export default function Avatar() {
	const { updateAvatar } = useAuthProvider();
	const [modal, setModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {
		pickImageFromGallery,
		attachmentSrc,
		removeAttachment,
		uploadAttachment,
	} = useAttachments();

	async function update() {
		try {
			setIsLoading(true);
			const uri = await uploadAttachment();
			await updateAvatar(uri);
			removeAttachment();
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.SHORT, Toast.CENTER);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<>
			<Container>
				<Card containerStyle={{ width: `80%` }}>
					<Card.Title h3>Update Avatar</Card.Title>
					<Button
						loading={isLoading}
						onPress={pickImageFromGallery}
						raised
						title={attachmentSrc ? 'Change Attachment' : 'Add Attachment'}
						containerStyle={{ marginTop: 10, marginBottom: 10 }}
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
								containerStyle={{ marginTop: 10, marginBottom: 10 }}
							/>
						</>
					)}
					{Boolean(attachmentSrc) && (
						<Button
							title='Update Image'
							raised
							onPress={update}
							loading={isLoading}
						/>
					)}
				</Card>
			</Container>
			<ImageModal
				onDismiss={() => setModal(false)}
				isOpen={modal}
				imgUri={attachmentSrc}
			/>
		</>
	);
}
