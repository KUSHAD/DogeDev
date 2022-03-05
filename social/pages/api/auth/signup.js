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
			body: { email, password, name, username, remember },
		} = req;

		if (username.toLowerCase().includes('update'))
			return res.status(400).json({ message: 'Username not allowed' });

		await connectDB();
		const findEmail = await Users.findOne({ email: email.toLowerCase() });
		const findUsername = await Users.findOne({
			username: username.toLowerCase(),
		});

		if (findEmail)
			return res.status(400).json({
				message: `Email already in use by another account`,
			});

		if (findUsername)
			return res.status(400).json({
				message: `Username already in use by another account`,
			});

		const usernameLower = username.toLowerCase();

		const otp = Math.floor(100000 + Math.random() * 900000);

		const otpToken = await generateOTPToken({
			email,
			password,
			name,
			usernameLower,
			otp,
			remember,
		});

		await sendMail(
			email,
			`${otp} - Your DDSocial Account Verification`,
			`
			<p>
				<strong>${otp}</strong> is your DDSocial Account Verification OTP,Enter this otp to verify your email and create your account
			</p>
		`
		);

		return res.status(200).json({
			message: 'Please provide the OTP sent to your inbox,valid for 1 hr',
			user: {
				OTPToken: otpToken,
				email,
				username,
				password,
				name,
				remember,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
