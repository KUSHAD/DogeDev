import { environment } from '../../environment';
export async function uploadAvatar(file) {
	const formData = new FormData();

	formData.append('file', file);
	formData.append('upload_preset', environment.cloudinary.preset);
	formData.append('cloud_name', environment.cloudinary.cloud_name);

	const res = await fetch(environment.cloudinary.url, {
		method: 'POST',
		body: formData,
	});

	const { secure_url: img_url } = await res.json();

	return img_url;
}
