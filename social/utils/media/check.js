export function checkImage(file) {
	let err = '';
	if (!file) return (err = 'File does not exist.');

	if (file.size > 1024 * 1024 * 2)
		// 1mb
		err = 'The largest image size is 2mb.';

	if (file.type !== 'image/jpeg' && file.type !== 'image/png')
		err = 'Image format is incorrect.';

	return err;
}