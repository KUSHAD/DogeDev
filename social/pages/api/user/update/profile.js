import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import authMiddleware from '../../../../middlewares/auth';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'PATCH':
			getUser(req, res);
			break;
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function getUser(req, res) {
	try {
		const {
			body: { story, username, name },
		} = req;
		await connectDB();
		const authUser = await authMiddleware(req, res);

		const findUsername = await Users.find({
			username: username.toLowerCase(),
			_id: { $ne: authUser._id },
		});

		if (findUsername.length !== 0)
			return res
				.status(400)
				.json({ message: 'Username already in use by another account' });

		await Users.findOneAndUpdate(
			{ _id: authUser._id },
			{
				name: name,
				username: username.toLowerCase(),
				story: story,
			}
		);

		res.status(200).json({
			message: 'Default profile updated sucessfully',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
