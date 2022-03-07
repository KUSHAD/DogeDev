import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import authMiddleware from '../../../../middlewares/auth';
import bcrypt from 'bcrypt';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'PATCH':
			updatePass(req, res);
			break;
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function updatePass(req, res) {
	try {
		const {
			body: { currentPass, password },
		} = req;
		await connectDB();

		const authUser = await authMiddleware(req, res);

		const user = await Users.findOne({
			_id: authUser._id,
		});

		if (!user)
			return res.status(400).json({
				message: 'No user found correspnding to the ID provided',
			});

		const matchPass = await bcrypt.compare(currentPass, user.password);

		if (!matchPass)
			return res.status(400).json({
				message:
					'Current Password is incorrect kindly double check your password',
			});

		const passwordHash = await bcrypt.hash(password, 12);

		await Users.findOneAndUpdate(
			{
				_id: authUser._id,
			},
			{
				password: passwordHash,
			}
		);

		return res.status(200).json({
			message: 'Password updated successfully',
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
