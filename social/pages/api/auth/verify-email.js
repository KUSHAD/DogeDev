import connectDB from '../../../utils/connectDB';
import Users from '../../../models/user';
import { decodeOTPToken } from '../../../utils/tokens/decode';
import {
	generateAccessToken,
	generateRefreshToken,
} from '../../../utils/tokens/generate';

import bcrypt from 'bcrypt';
import Cookies from 'cookies';
import { environment } from '../../../environment';

export default function handler(req, res) {
	const { method } = req;

	switch (method) {
		case 'POST':
			verifyEmail(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function verifyEmail(req, res) {
	try {
		const {
			body: { OTPToken, otp },
		} = req;

		await connectDB();

		const {
			email,
			password,
			username,
			name,
			remember,
			otp: _otp,
		} = await decodeOTPToken(OTPToken);

		if (Number(otp) !== Number(_otp))
			return res.status(400).json({
				message: 'Incorrect OTP. Double check your OTP and resubmit',
			});

		const findEmail = await Users.findOne({ email });
		const findUsername = await Users.findOne({ username });

		if (findEmail)
			return res.status(400).json({
				message: `Email already in use by another account`,
			});

		if (findUsername)
			return res.status(400).json({
				message: `Username already in use by another account`,
			});

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = new Users({
			name,
			username,
			email,
			password: passwordHash,
		});

		const accessToken = await generateAccessToken({ id: newUser._id });

		if (remember) {
			const cookies = new Cookies(req, res, environment.tokenKey);
			const refreshToken = await generateRefreshToken({ id: newUser._id });
			await cookies.set('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/api/refresh-token',
				maxAge: 31556952000,
			});
		}

		await newUser.save();

		res.status(200).json({
			message: 'Signed in succesfully !!',
			auth: {
				token: accessToken,
				user: {
					...newUser._doc,
					password: '',
				},
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message.replace('jwt', 'Token'),
		});
	}
}
