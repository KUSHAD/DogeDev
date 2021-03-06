export const environment = {
	firebase: {
		apiKey: 'YOUR_REACT_APP_FIREBASE_API_KEY',
		authDomain: 'YOUR_REACT_APP_FIREBASE_AUTH_DOMAIN',
		projectId: 'YOUR_REACT_APP_FIREBASE_PROJECT_ID',
		storageBucket: 'YOUR_REACT_APP_FIREBASE_STORAGE_BUCKET',
		messagingSenderId: 'YOUR_REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
		appId: 'YOUR_REACT_APP_FIREBASE_APP_ID',
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
		cloud_name: `cloud_name`,
		url: `https://api.cloudinary.com/v1_1/cloud_name/image/upload`,
		preset: `upload_preset`,
	},
	pusNotifEndpoint: 'https://exp.host/--/api/v2/push/send',
	questionStats: {
		answered: 'answered',
		unanswered: 'unanswered',
	},
	notificationStatus: {
		read: 'read',
		unread: 'unread',
	},
};
