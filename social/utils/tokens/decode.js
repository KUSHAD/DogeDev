import jwt from 'jsonwebtoken';
import { environment } from '../../environment';

export function decodeOTPToken(token) {
	return jwt.decode(token, environment.jwtSecrets.otp);
}

export function decodeRefreshToken(token) {
	return jwt.decode(token, environment.jwtSecrets.refresh);
}

export function decodeAccessToken(token) {
	return jwt.decode(token, environment.jwtSecrets.access);
}
