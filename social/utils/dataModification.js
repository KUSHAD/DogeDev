export function editData(data, id, payload) {
	const newData = data.map(item => (item._id === id ? payload : item));
	return newData;
}

export function deleteData(data, id) {
	const newData = data.filter(item => item._id !== id);
	return newData;
}
