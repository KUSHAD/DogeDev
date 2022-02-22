import { GLOBAL_TYPES } from '../../../utils/reduxTypes';

const _state = {};

function authReducer(state = _state, { type, payload }) {
	switch (type) {
		case GLOBAL_TYPES.auth:
			return payload;
		default:
			return state;
	}
}

export default authReducer;
