import connectDB from '../../../utils/connectDB';
import Users from '../../../models/user';
import {
	generateRefreshToken,
	generateAccessToken,
} from '../../../utils/tokens/generate';
import bcrypt from 'bcrypt';
import { setCookies } from 'cookies-next';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'POST':
			login(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function login(req, res) {
	try {
		const {
			body: { remember, identity, password },
		} = req;
		await connectDB();
		const user = await Users.findOne({
			$or: [
				{
					email: identity,
				},
				{
					username: identity,
				},
			],
		}).populate(
			'followers following',
			'avatar username name followers following'
		);

		if (!user)
			return res.status(400).json({
				message: 'No user corresponding to the email or username provided',
			});

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch)
			return res.status(400).json({
				message: 'Incorrect password',
			});

		const accessToken = await generateAccessToken({ id: user._id });

		if (remember) {
			const refreshToken = await generateRefreshToken({ id: user._id });
			setCookies('refreshToken', refreshToken, {
				req,
				res,
				httpOnly: true,
				path: '/api/refresh-token',
				maxAge: 31536000,
			});
		}

		return res.status(200).json({
			message: 'Logged in succesfully !!',
			auth: {
				token: accessToken,
				user: {
					...user._doc,
					password: '',
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
