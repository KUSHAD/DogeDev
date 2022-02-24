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

		if (!req.cookies.refreshToken) return res.status(400).end();

		const { id } = await decodeRefreshToken(req.cookies.refreshToken);

		const user = await Users.findOne({ _id: id }).populate(
			'followers following',
			'avatar username name followers following'
		);

		if (!user) return res.status(400).end();

		const accessToken = await generateAccessToken({ id: user._id });

		return res.status(200).json({
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
			message: error.message.replace('jwt', 'Token'),
		});
	}
}
