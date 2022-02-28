import { PROFILE_TYPES, GLOBAL_TYPES } from '../../utils/reduxTypes';
import { getAPI, patchAPI } from '../../utils/fetchData';
export function getProfileUsers({ users, username }) {
	return async dispatch => {
		if (users.every(_user => _user.username !== username)) {
			try {
				console.log(username);
				dispatch({
					type: PROFILE_TYPES.loading,
					payload: true,
				});
				const res = await getAPI(`user/get/${username}`);
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

export function updateDefaultProfile({ data, auth }) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});
			const res = await patchAPI(`user/update/profile`, data, auth.token);

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					...auth,
					user: {
						...auth.user,
						username: data.username.toLowerCase(),
						name: data.name,
						story: data.story,
					},
				},
			});

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: {
					success: res.data.message,
				},
			});
		} catch (error) {
			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error.response.data.message },
			});
		} finally {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: false,
			});
		}
	};
}
