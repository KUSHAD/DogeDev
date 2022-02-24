import connectDB from '../../../utils/connectDB';
import Users from '../../../models/user';
import authMiddleware from '../../../middlewares/auth';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'GET':
			search(req, res);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function search(req, res) {
	try {
		const {
			query: { user },
		} = req;
		await connectDB();
		await authMiddleware(req, res);
		const users = await Users.find({ username: { $regex: user } })
			.limit(10)
			.select('name username avatar');

		res.status(200).json({
			users: users,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
