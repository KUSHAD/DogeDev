import axios from 'axios';

export async function postAPI(_url, _body, _token) {
	const _res = await axios.post(`/api/${_url}`, _body, {
		headers: {
			Authorization: _token,
		},
	});
	return _res;
}
