import { PROFILE_TYPES, GLOBAL_TYPES } from '../../utils/reduxTypes';
import { getAPI, patchAPI, postAPI } from '../../utils/fetchData';
import { uploadAvatar } from '../../utils/media/upload';
import { deleteData } from '../../utils/dataModification';
export function getProfileUsers({ users, id }) {
	return async dispatch => {
		if (users.every(_user => _user._id !== id)) {
			try {
				dispatch({
					type: PROFILE_TYPES.loading,
					payload: true,
				});
				const res = await getAPI(`user/get/${id}`);
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

export function updateAvatar({ avatar, auth }, setAvatar) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const img_url = await uploadAvatar(avatar);

			const res = await patchAPI(
				`user/update/avatar`,
				{ avatar: img_url },
				auth.token
			);

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					...auth,
					user: {
						...auth.user,
						avatar: img_url,
					},
				},
			});

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: {
					success: res.data.message,
				},
			});

			setAvatar('');
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

export function updateEmail(data, auth, setCurrent) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const res = await postAPI('user/update/email', data, auth.token);

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					...auth,
					OTPToken: res.data.token,
					tempEmail: data.email,
				},
			});

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: {
					success: res.data.message,
				},
			});

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

export function verifyEmail({ otp, OTPToken }, auth, setCurrent) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});
			const res = await patchAPI(
				'user/update/verify-email',
				{ otp, OTPToken },
				auth.token
			);

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					token: auth.token,
					user: {
						...auth.user,
						email: res.data.email,
					},
				},
			});

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: {
					success: res.data.message,
				},
			});

			setCurrent(0);
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

export function updatePass({ currentPass, password }, auth, form) {
	return async dispatch => {
		try {
			dispatch({
				type: GLOBAL_TYPES.loading,
				payload: true,
			});

			const res = await patchAPI(
				'user/update/update-password',
				{ currentPass, password },
				auth.token
			);

			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: {
					success: res.data.message,
				},
			});

			form[0].resetFields();
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

export function follow({ users, user, auth }) {
	return dispatch => {
		try {
			let newUser = { ...user, followers: [...user.followers, auth.user] };
			dispatch({
				type: PROFILE_TYPES.follow,
				payload: newUser,
			});
			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					...auth,
					user: { ...auth.user, following: [...auth.user.following, newUser] },
				},
			});
		} catch (error) {
			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error.response.data.message },
			});
		}
	};
}

export function unFollow({ users, user, auth }) {
	return dispatch => {
		try {
			let newUser = {
				...user,
				followers: deleteData(user.followers, auth.user._id),
			};

			dispatch({
				type: PROFILE_TYPES.unfollow,
				payload: newUser,
			});

			dispatch({
				type: GLOBAL_TYPES.auth,
				payload: {
					...auth,
					user: {
						...auth.user,
						following: deleteData(auth.user.following, newUser._id),
					},
				},
			});
		} catch (error) {
			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error.response.data.message },
			});
		}
	};
}
