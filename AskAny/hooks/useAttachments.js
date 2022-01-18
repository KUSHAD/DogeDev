import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-simple-toast';
import { environment } from '../environment';

export function useAttachments() {
	const [attachmentSrc, setAttachmentSrc] = useState('');

	async function pickImageFromGallery() {
		try {
			const data = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1],
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				base64: true,
			});
			setAttachmentSrc(`data:image/jpg;base64,${data.base64}`);
		} catch (error) {
			Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
		}
	}

	function removeAttachment() {
		setAttachmentSrc('');
	}

	async function uploadAttachment() {
		if (!attachmentSrc) return;
		const formData = new FormData();
		formData.append('file', attachmentSrc);
		formData.append('upload_preset', environment.cloudinary.preset);
		formData.append('cloud_name', environment.cloudinary.cloud_name);
		const res = await fetch(environment.cloudinary.url, {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();
		const secureUrl = data.secure_url;
		return secureUrl;
	}

	return {
		attachmentSrc,
		pickImageFromGallery,
		removeAttachment,
		uploadAttachment,
	};
}
