import { GLOBAL_TYPES } from '../../../utils/reduxTypes';

function loadingReducer(state = false, { type, payload }) {
	switch (type) {
		case GLOBAL_TYPES.loading:
			return payload;
		default:
			return state;
	}
}

export default loadingReducer;
