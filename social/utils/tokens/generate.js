import jwt from 'jsonwebtoken';
import { environment } from '../../environment';

export function generateOTPToken(payload) {
	return jwt.sign(payload, environment.jwtSecrets.otp, {
		expiresIn: 600,
	});
}

export function generateAccessToken(payload) {
	return jwt.sign(payload, environment.jwtSecrets.access, {
		expiresIn: 86400,
	});
}

export function generateRefreshToken(payload) {
	return jwt.sign(payload, environment.jwtSecrets.refresh, {
		expiresIn: 31536000,
	});
}
