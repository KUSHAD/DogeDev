import { PROFILE_TYPES } from '../../utils/reduxTypes';

const initialState = { users: [], posts: [] };

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
		default:
			return state;
	}
}
