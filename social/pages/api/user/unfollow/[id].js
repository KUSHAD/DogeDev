import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import validObjectID from '../../../../utils/validObjectID';
import authMiddleWare from '../../../../middlewares/auth';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'PATCH':
			unfollow(req, res);
			break;
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function unfollow(req, res) {
	try {
		const {
			query: { id },
		} = req;

		await connectDB();

		const validUserId = validObjectID(id);

		if (!validUserId)
			return res.status(400).json({
				message: 'No user found corresponding to the ID provided',
			});

		const authUser = await authMiddleWare(req, res);

		await Users.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$pull: {
					following: authUser._id,
				},
			},
			{ new: true }
		);

		await Users.findOneAndUpdate(
			{
				_id: authUser._id,
			},
			{
				$pull: {
					followers: id,
				},
			},
			{ new: true }
		);

		return res.status(200).json({
			message: 'User unfollowed',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
