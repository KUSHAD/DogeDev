import connectDB from '../../../../utils/connectDB';
import Users from '../../../../models/user';
import authMiddleware from '../../../../middlewares/auth';
import { generateOTPToken } from '../../../../utils/tokens/generate';
import sendMail from '../../../../utils/sendMail';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'POST':
			updateEmail(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function updateEmail(req, res) {
	try {
		const {
			body: { email },
		} = req;
		await connectDB();
		const authUser = await authMiddleware(req, res);

		if (email === authUser.email)
			return res.status(400).json({
				message: 'The email is same. Skipping further processing.....',
			});

		const findEmail = await Users.find({
			email: email.toLowerCase(),
			_id: { $ne: authUser._id },
		});

		if (findEmail.length !== 0)
			return res
				.status(400)
				.json({ message: 'Email already in use by another account' });

		const otp = Math.floor(100000 + Math.random() * 900000);

		const otpToken = await generateOTPToken({
			email,
			otp,
		});

		await sendMail(
			email,
			`${otp} - Your DDSocial Email Update Verification`,
			`
			<p>
				<strong>${otp}</strong> is your DDSocial Email Update Verification OTP,Enter this otp to verify your email and update your account's email address.
			</p>
		`
		);

		return res.status(200).json({
			message: 'Please provide the OTP sent to your inbox,valid for 1 hr',
			token: otpToken,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}
