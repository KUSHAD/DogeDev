import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import authMiddleware from '../../../../middlewares/auth';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'PATCH':
			updateAvatar(req, res);
			break;
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function updateAvatar(req, res) {
	try {
		const {
			body: { avatar },
		} = req;
		await connectDB();
		const authUser = await authMiddleware(req, res);

		await Users.findOneAndUpdate(
			{ _id: authUser._id },
			{
				avatar: avatar,
			}
		);

		res.status(200).json({
			message: 'Avatar updated sucessfully',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
