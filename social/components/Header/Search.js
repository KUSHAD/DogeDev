import { Dropdown, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { GLOBAL_TYPES } from '../../utils/reduxTypes';
import { getAPI } from '../../utils/fetchData';
import UserCard from '../UserCard';

export default function Search() {
	const [searchTerm, setSearchTerm] = useState('');
	const [users, setUsers] = useState([]);
	const { auth } = useSelector(state => state);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!searchTerm) return setUsers([]);
		searchUsers();
	}, [searchTerm]);
	async function searchUsers() {
		try {
			const { data } = await getAPI(
				`user/search?user=${searchTerm}`,
				auth.token
			);
			setUsers(data.users);
		} catch (error) {
			dispatch({
				type: GLOBAL_TYPES.alert,
				payload: { error: error.response.data.message },
			});
		}
	}
	return (
		<>
			<Dropdown
				arrow
				placement='topCenter'
				destroyPopupOnHide
				visible={Boolean(searchTerm)}
				overlay={() => (
					<>
						{users.map(_user => (
							<UserCard
								user={_user}
								key={_user._id}
								onClose={() => setSearchTerm('')}
							/>
						))}
					</>
				)}
			>
				<div className='md:mt-4 mt-1'>
					<Input.Search
						placeholder='Search'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onSearch={searchUsers}
					/>
				</div>
			</Dropdown>
		</>
	);
}
