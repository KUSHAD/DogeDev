import { Button, Card } from 'antd';
import SuperAvatar from '../../Avatar/Super';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { checkImage } from '../../../utils/media/check';
import { GLOBAL_TYPES } from '../../../utils/reduxTypes';
import { updateAvatar } from '../../../redux/actions/profile.action';
export default function Avatar() {
	const { auth, loading } = useSelector(state => state);
	const [avatar, setAvatar] = useState('');
	const dispatch = useDispatch();

	async function onChange(e) {
		const file = e.target.files[0];
		const error = await checkImage(file);
		if (error)
			return dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error },
			});

		setAvatar(file);
	}

	function onUpload() {
		dispatch(updateAvatar({ avatar, auth }, setAvatar));
	}

	return (
		<Card>
			<div className='flex w-full justify-center my-2'>
				<SuperAvatar
					src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
				/>
			</div>
			{avatar && (
				<Button
					loading={loading}
					danger
					onClick={() => setAvatar('')}
					className='w-1/2'
				>
					Remove Image
				</Button>
			)}
			<Button
				loading={loading}
				className={`${avatar ? 'w-1/2' : 'w-full'} mb-2`}
			>
				<input
					disabled={loading}
					onChange={onChange}
					type='file'
					className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
				/>
				Change Image
			</Button>
			{avatar && (
				<Button
					onClick={onUpload}
					loading={loading}
					type='primary'
					className='w-full'
				>
					Update Avatar
				</Button>
			)}
		</Card>
	);
}
