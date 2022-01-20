export const environment = {
	firebase: {
		apiKey: 'AIzaSyBKM6csgh_IxYyVFCRmw7z-1BoFbnB0hWk',
		authDomain: 'askany-dogedev.firebaseapp.com',
		projectId: 'askany-dogedev',
		storageBucket: 'askany-dogedev.appspot.com',
		messagingSenderId: '929749867484',
		appId: '1:929749867484:web:6139f0ef29142c44f5cd19',
	},
	validationRegex: {
		email:
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
	},
	subjects: [
		'Maths',
		'English',
		'History',
		'Civics',
		'Geography',
		'Economics',
		'Physics',
		'Chemistry',
		'Biology',
		'Hindi',
		'Bengali',
		'Sankskrit',
		'French',
		'German',
		'Other Subjects',
	],
	cloudinary: {
		cloud_name: `kushad`,
		url: `https://api.cloudinary.com/v1_1/kushad/image/upload`,
		preset: `askanyDogeDev`,
	},
	pusNotifEndpoint: 'https://exp.host/--/api/v2/push/send',
};
