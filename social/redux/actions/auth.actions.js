import { GLOBAL_TYPES } from '../../utils/reduxTypes';
import { deleteAPI, postAPI } from '../../utils/fetchData';

export function signup(data, setCurrent) {
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
			setCurrent(1);
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

export function verifyOTP(data, router) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const res = await postAPI('auth/verify-email', data);

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { success: res.data.message },
			});

			dispatch({ type: GLOBAL_TYPES.auth, payload: res.data.auth });
			router.push('/', '/');
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

export function login(data, router) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const res = await postAPI('auth/login', data);

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { success: res.data.message },
			});

			dispatch({ type: GLOBAL_TYPES.auth, payload: res.data.auth });
			router.push('/', '/');
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

export function getAccessToken() {
	return async dispatch => {
		try {
			const res = await postAPI('refresh-token');

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: res.data.auth,
			});
		} catch (error) {
			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error.response.data.message },
			});
		} finally {
			dispatch({
				type: GLOBAL_TYPES.authLoading,
				payload: false,
			});
		}
	};
}

export function logout() {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});
			await deleteAPI('auth/logout');
			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {},
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
