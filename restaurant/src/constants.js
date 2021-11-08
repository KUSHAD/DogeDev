const constants = {
	FIREBASE: {
		apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
		authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
		projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
		storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
		messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
		appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
		measurementId: `${process.env.REACT_APP_FIREBASE_MEASURMENT_ID}`,
	},
	TABLE_STATUS: {
		IN_PROGRESS: 'inProgress',
		BILLED: 'billed',
	},
	SPREAD_SHEET: {
		ID: `${process.env.REACT_APP_GOOGLE_SPREAD_SHEET_ID}`,
	},
	VALID_PHONES: ['8888888888', '9999999999'],
	ADMIN_PHONES: ['9999999999'],
	SELECT_OPTIONS: {
		EXPENDITURE: {
			PAYMENT: ['CASH', 'CHEQUE', 'DD', 'UPI', 'BANK TRANSFER'],
		},
	},
};

export default constants;
