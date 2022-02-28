import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'GET':
			getUser(req, res);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function getUser(req, res) {
	try {
		const {
			query: { username },
		} = req;
		await connectDB();
		const user = await Users.findOne({
			username: username.toLowerCase(),
		}).select('-password');

		if (!user)
			return res
				.status(400)
				.json({
					message: 'No user found corresponding to the username provided',
				});

		res.status(200).json({
			user: user,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
