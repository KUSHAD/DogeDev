import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unFollow } from '../../redux/actions/profile.action';

export default function FollowButton({ user }) {
	const [followed, setFollowed] = useState(false);

	const { auth, profile } = useSelector(state => state);
	const dispatch = useDispatch();

	useEffect(() => {
		if (auth.user.following.find(_user => _user._id === user._id)) {
			setFollowed(true);
		}
	}, [auth.user.following, user._id]);

	function handleFollow() {
		setFollowed(true);
		dispatch(follow({ users: profile.users, user, auth }));
	}

	function handleUnFollow() {
		setFollowed(false);
		dispatch(unFollow({ users: profile.users, user, auth }));
	}

	return followed ? (
		<Button onClick={handleUnFollow} type='default' className='w-full'>
			Unfollow
		</Button>
	) : (
		<Button onClick={handleFollow} type='primary' className='w-full'>
			Follow
		</Button>
	);
}
