import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import authMiddleware from '../../../../middlewares/auth';
import { decodeOTPToken } from '../../../../utils/tokens/decode';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'PATCH':
			verifyEmail(req, res);
			break;
		default:
			res.setHeader('Allow', ['PATCH']);
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

		const authUser = await authMiddleware(req, res);
		const { email, otp: _otp } = await decodeOTPToken(OTPToken);

		if (Number(otp) !== Number(_otp))
			return res.status(400).json({
				message: 'Incorrect OTP. Double check your OTP and resubmit',
			});

		const findEmail = await Users.find({
			email: email.toLowerCase(),
			_id: { $ne: authUser._id },
		});

		if (findEmail.length !== 0)
			return res
				.status(400)
				.json({ message: 'Email already in use by another account' });

		await Users.findOneAndUpdate(
			{ _id: authUser._id },
			{
				email: email,
			}
		);

		return res.status(200).json({
			message: 'Email updated succesfully',
			email: email,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message.replace('jwt', 'Token'),
		});
	}
}
