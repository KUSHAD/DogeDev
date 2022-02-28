import mongoose from 'mongoose';
import { environment } from '../environment';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 25,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			maxlength: 25,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: environment.defaultAvatar,
		},
		story: {
			type: String,
			default: '',
			maxlength: 200,
		},
		followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
		following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.user || mongoose.model('user', UserSchema);
