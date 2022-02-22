import { GLOBAL_TYPES } from '../../utils/reduxTypes';
import { postAPI } from '../../utils/fetchData';

export function signup(data) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const res = await postAPI('auth/signup', data);

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { success: res.data.message },
			});

			dispatch({ type: GLOBAL_TYPES.auth, payload: res.data.user });
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
