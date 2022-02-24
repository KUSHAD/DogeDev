import { removeCookies } from 'cookies-next';
import authMiddleware from '../../../middlewares/auth';
export default function handler(req, res) {
	const { method } = req;
	switch (method) {
		case 'DELETE':
			logout(req, res);
			break;
		default:
			res.setHeader('Allow', ['DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
			break;
	}
}

async function logout(req, res) {
	try {
		await authMiddleware(req, res);
		await removeCookies('refreshToken', {
			req,
			res,
			httpOnly: true,
			path: '/api/refresh-token',
			maxAge: 31536000,
		});
		res.status(200).json({
			message: 'Logged out',
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
}
