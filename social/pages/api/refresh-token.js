import connectDB from '../../utils/connectDB';
import Users from '../../models/user';
import { generateAccessToken } from '../../utils/tokens/generate';
import { decodeRefreshToken } from '../../utils/tokens/decode';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'POST':
			getAccessToken(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function getAccessToken(req, res) {
	try {
		await connectDB();
		const { id } = await decodeRefreshToken(req.cookies.refreshToken);

		const user = await Users.findOne({ _id: id });

		if (!user)
			return res.status(400).json({
				message: 'Token corrupted. Login again !!!',
			});

		const accessToken = await generateAccessToken({ id: user._id });

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
