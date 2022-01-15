import { useState } from 'react';
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
import ImageModal from '../../Components/ImageModal';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export default function AdditionalConfigsQ() {
	const [subject, setSubject] = useState('');
	const [subjectSheet, setSubjectSheet] = useState(false);
	const [attSheet, setAttSheet] = useState(false);
	const [modal, setModal] = useState(false);
	const {
		attachmentSrc,
		cameraRef,
		captureCameraImage,
		closeCamera,
		openCamera,
		pickImageFromGallery,
		removeAttachment,
		showCamera,
	} = useAttachments();
	const isFocused = useIsFocused();
	async function takePicture() {
		await openCamera();
		setAttSheet(false);
	}
	return (
		<>
			<Container>
				<SafeAreaView style={{ width: `80%` }}>
					<Button
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
						title='Add Attachments'
						raised
						onPress={() => setAttSheet(true)}
					/>
					<BottomSheet isVisible={attSheet}>
						<ListItem onPress={takePicture}>
							<ListItem.Title>Camera</ListItem.Title>
						</ListItem>
						<ListItem
							onPress={() => {
								setAttSheet(false);
								pickImageFromGallery();
							}}
						>
							<ListItem.Title>Filesystem</ListItem.Title>
						</ListItem>
						<Button
							title='Close'
							type='clear'
							buttonStyle={{ backgroundColor: colors.white }}
							titleStyle={{ color: colors.error }}
							onPress={() => setAttSheet(false)}
						/>
					</BottomSheet>
					{showCamera && isFocused ? (
						<Camera
							ref={cameraRef}
							autoFocus='auto'
							type='back'
							style={{ flex: 1 }}
							onCameraReady={() => console.log('Camera Reday')}
						>
							<SafeAreaView style={{ flex: 0.5 }}>
								<Button title='Scan' />
							</SafeAreaView>
						</Camera>
					) : (
						Boolean(attachmentSrc) && (
							<TouchableOpacity
								style={{ marginTop: 10 }}
								onPress={() => setModal(true)}
								onLongPress={() => setAttSheet(true)}
							>
								<Image
									source={{ uri: attachmentSrc }}
									style={{ width: `100%`, aspectRatio: 1 / 1 }}
								/>
							</TouchableOpacity>
						)
					)}
				</SafeAreaView>
			</Container>
			{Boolean(subject) && <Button title='Add Question' />}
			<ImageModal
				imgUri={attachmentSrc}
				isOpen={modal}
				onDismiss={() => setModal(false)}
			/>
		</>
	);
}
