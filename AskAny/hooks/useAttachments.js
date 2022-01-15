import { Camera } from 'expo-camera';
import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-simple-toast';

export function useAttachments() {
	const [showCamera, setShowCamera] = useState(false);
	const [attachmentSrc, setAttachmentSrc] = useState('');

	const cameraRef = useRef();

	async function openCamera() {
		try {
			await Camera.getCameraPermissionsAsync();
			setShowCamera(true);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function captureCameraImage() {
		try {
			if (cameraRef.current) {
				const options = { quality: 1, skipProcessing: false, base64: false };
				const data = await cameraRef.current.takePictureAsync(options);
				if (data) {
					setAttachmentSrc(data.uri);
					setShowCamera(false);
				}
			}
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	async function pickImageFromGallery() {
		try {
			const data = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1],
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				base64: false,
			});
			setAttachmentSrc(data.uri);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	function removeAttachment() {
		setAttachmentSrc('');
	}

	function closeCamera() {
		setShowCamera(false);
	}

	return {
		openCamera,
		captureCameraImage,
		cameraRef,
		attachmentSrc,
		showCamera,
		pickImageFromGallery,
		removeAttachment,
		closeCamera,
	};
}
