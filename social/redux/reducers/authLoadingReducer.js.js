import { GLOBAL_TYPES } from '../../utils/reduxTypes';

function authLoadingReducer(state = true, { type, payload }) {
	switch (type) {
		case GLOBAL_TYPES.authLoading:
			return payload;
		default:
			return state;
	}
}

export default authLoadingReducer;
