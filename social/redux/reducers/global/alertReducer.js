import { GLOBAL_TYPES } from '../../../utils/reduxTypes';

function alertReducer(state = {}, { type, payload }) {
	switch (type) {
		case GLOBAL_TYPES.alert:
			return payload;
		default:
			return state;
	}
}

export default alertReducer;
