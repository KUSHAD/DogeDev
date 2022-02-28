import Users from '../models/user';
import { decodeAccessToken } from '../utils/tokens/decode';
export default async function authMiddleware(req, res) {
	try {
		const token = req.headers.authorization;
		if (!token)
			return res.status(400).json({ message: 'Unauthenticated Request !!!' });

		const decoded = await decodeAccessToken(token);

		if (!decoded)
			return res.status(400).json({ message: 'Unauthenticated Request !!!' });

		const user = await Users.findOne({ _id: decoded.id });

		return { _id: user._id, name: user.name, username: user.username };
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
