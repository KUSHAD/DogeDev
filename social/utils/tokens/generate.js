import jwt from 'jsonwebtoken';
import { environment } from '../../environment';

export function generateOTPToken(payload) {
	return jwt.sign(payload, environment.jwtSecrets.otp, {
		expiresIn: 600,
	});
}
