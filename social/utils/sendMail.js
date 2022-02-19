const nodemailer = require('nodemailer');
import { OAuth2Client } from 'google-auth-library';
import { environment } from '../environment';
async function sendMail(to, subject, body) {
	const oAuth2Client = new OAuth2Client(
		environment.mailCreds.clientID,
		environment.mailCreds.clientSecret,
		environment.mailCreds.playGroundURL
	);
	oAuth2Client.setCredentials({
		refresh_token: environment.mailCreds.refreshToken,
	});
	const access_token = await oAuth2Client.getAccessToken();
	const transport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: environment.mailCreds.senderMail,
			clientId: environment.mailCreds.clientID,
			clientSecret: environment.mailCreds.clientSecret,
			refreshToken: environment.mailCreds.refreshToken,
			access_token,
		},
	});

	const opts = {
		from: environment.mailCreds.senderMail,
		to: to,
		html: body,
		subject: subject,
	};

	return transport.sendMail(opts);
}

export default sendMail;
