import { notification } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBAL_TYPES } from '../utils/reduxTypes';
export default function Layout({ children }) {
	const { alert } = useSelector(state => state);

	const dispatch = useDispatch();

	useEffect(() => {
		if (alert.success) {
			notification.success({
				message: 'Success',
				description: alert.success,
				onClose: () => {
					dispatch({
						type: GLOBAL_TYPES.alert,
						payload: {},
					});
				},
				onClick: () => {
					dispatch({
						type: GLOBAL_TYPES.alert,
						payload: {},
					});
				},
			});
		}

		if (alert.error) {
			notification.error({
				message: 'Error',
				description: alert.error,
				onClose: () => {
					dispatch({
						type: GLOBAL_TYPES.alert,
						payload: {},
					});
				},
				onClick: () => {
					dispatch({
						type: GLOBAL_TYPES.alert,
						payload: {},
					});
				},
			});
		}
	}, [alert]);

	return (
		<div className='w-full min-h-screen bg-gray-200'>
			<div className='max-w-5xl w-full min-h-screen m-auto'>{children}</div>
		</div>
	);
}
