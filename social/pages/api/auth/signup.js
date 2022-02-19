import connectDB from '../../../utils/connectDB';
import Users from '../../../models/user';
import sendMail from '../../../utils/sendMail';
import { generateOTPToken } from '../../../utils/tokens/generate';

export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'POST':
			signup(req, res);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function signup(req, res) {
	try {
		const {
			body: { email, password, name, username },
		} = req;
		await connectDB();
		const findEmail = await Users.findOne({ email });
		const findUsername = await Users.findOne({ username });

		if (findEmail)
			return res.status(400).json({
				message: `Email already in use by another account`,
			});

		if (findUsername)
			return res.status(400).json({
				message: `Username already in use by another account`,
			});

		const otp = Math.floor(100000 + Math.random() * 900000);

		const otpToken = await generateOTPToken({
			email,
			password,
			name,
			username,
			otp,
		});

		await sendMail(
			email,
			`${otp} - Your DDSocial Account Verification`,
			`
			<p>
				<strong>${otp}</strong> is your DDSocial Account Verification,Enter this otp to verify your email and create your account
			</p>
		`
		);

		res.status(200).json({
			message: 'Please provide the OTP sent to your inbox,valid for 10 mins',
			user: {
				OTPToken: otpToken,
				email,
				username,
				password,
				name,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}