import { editData } from '../../utils/dataModification';
import { PROFILE_TYPES } from '../../utils/reduxTypes';

const initialState = { users: [], loading: false };

export default function profileReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case PROFILE_TYPES.loading:
			return {
				...state,
				loading: payload,
			};
		case PROFILE_TYPES.getUser:
			return {
				...state,
				users: [...state.users, payload.user],
			};
		case PROFILE_TYPES.follow:
			return {
				...state,
				users: editData(state.users, payload._id, payload),
			};
		case PROFILE_TYPES.unfollow:
			return {
				...state,
				users: editData(state.users, payload._id, payload),
			};
		default:
			return state;
	}
}
