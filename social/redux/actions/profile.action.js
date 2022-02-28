import { PROFILE_TYPES, GLOBAL_TYPES } from '../../utils/reduxTypes';
export function getProfileUsers({ users, user }) {
	return async dispatch => {
		if (users.every(_user => _user._id !== user._id)) {
			try {
				dispatch({ type: PROFILE_TYPES.getUser, payload: { user: user } });
			} catch (error) {
				dispatch({
					type: GLOBAL_TYPES.alert,
					payload: { error: error.response.data.message || error.message },
				});
			}
		}
	};
}
