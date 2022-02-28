import axios from 'axios';

export async function postAPI(_url, _body, _token) {
	const _res = await axios.post(`/api/${_url}`, _body, {
		headers: {
			Authorization: _token,
		},
	});
	return _res;
}

export async function deleteAPI(_url, _token) {
	const _res = await axios.delete(`/api/${_url}`, {
		headers: {
			Authorization: _token,
		},
	});
	return _res;
}

export async function getAPI(_url, _token) {
	const _res = await axios.get(`/api/${_url}`, {
		headers: {
			Authorization: _token,
		},
	});
	return _res;
}

export async function patchAPI(_url, _body, _token) {
	const _res = await axios.patch(`/api/${_url}`, _body, {
		headers: {
			Authorization: _token,
		},
	});
	return _res;
}
