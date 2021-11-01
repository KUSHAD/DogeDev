const constants = {
  SELECT_OPTIONS: {
    INCOME: {
      PAYMENT: ["CASH", "CHEQUE", "DD", "UPI", "BANK TRANSFER"],
    },
    EXPENDITURE: {
      PAYMENT: ["CASH", "CHEQUE", "DD", "UPI", "BANK TRANSFER"],
    },
  },
  SPREADSHEET: {
    ID: `${process.env.REACT_APP_GOOGLE_SPREAD_SHEET_ID}`,
  },
  FIREBASE: {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
    measurementId: `${process.env.REACT_APP_FIREBASE_MEASURMENT_ID}`,
  },
  VALID_PHONES: ["8888888888", "6289606122", "9999999999"],
  SEX: ["MALE", "FEMALE", "OTHER"],
  BLOOD_GROUP: [
    "NOT KNOWN",
    "A+ve",
    "A-ve",
    "B+ve",
    "B-ve",
    "AB+ve",
    "AB-ve",
    "O+ve",
    "O-ve",
  ],
  EMAIL_REGEX:
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
};

export default constants;
