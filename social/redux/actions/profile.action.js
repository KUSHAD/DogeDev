import { PROFILE_TYPES, GLOBAL_TYPES } from '../../utils/reduxTypes';
import { getAPI } from '../../utils/fetchData';
export function getProfileUsers({ users, user }) {
	return async dispatch => {
		if (users.every(_user => _user._id !== user._id)) {
			try {
				dispatch({
					type: PROFILE_TYPES.loading,
					payload: true,
				});
				const res = await getAPI(`user/get/${user.username}`);
				dispatch({ type: PROFILE_TYPES.getUser, payload: res.data });
				dispatch({ type: PROFILE_TYPES.loading, payload: false });
			} catch (error) {
				dispatch({
					type: GLOBAL_TYPES.alert,
					payload: { error: error.response.data.message },
				});
			}
		}
	};
}
