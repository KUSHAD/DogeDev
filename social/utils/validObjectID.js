import mongoose from 'mongoose';

export default async function validObjectID(id) {
	const verifyObjectID = await mongoose.Types.ObjectId.isValid(id);
	return verifyObjectID;
}
