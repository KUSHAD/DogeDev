import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SuperAvatar from '../Avatar/Super';
import { Typography, Button } from 'antd';
import intFormatter from '../../utils/intFormatter';
import { getProfileUsers } from '../../redux/actions/profile.action';
import ImageModal from '../ImageModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function Info({ user }) {
	const [userData, setUserData] = useState([]);
	const [isViewImgModalOpen, setIsViewImgModalOpen] = useState(false);
	const { auth, profile } = useSelector(state => state);
	const dispatch = useDispatch();
	const {
		query: { username },
	} = useRouter();

	useEffect(() => {
		if (auth.token) {
			if (user._id === auth.user._id) {
				setUserData([auth.user]);
			} else {
				dispatch(getProfileUsers({ users: profile.users, user }));
				const newData = profile.users.filter(_user => _user._id === user._id);
				setUserData(newData);
			}
		} else {
			dispatch(getProfileUsers({ users: profile.users, user }));
			const newData = profile.users.filter(_user => _user._id === user._id);
			setUserData(newData);
		}
	}, [user._id, auth.user, dispatch, profile.users]);
	return (
		<div>
			{userData.map(_user => (
				<>
					<div
						key={_user._id}
						className='flex flex-col md:flex-row w-full md:max-w-lg justify-between'
					>
						<div
							onClick={() => setIsViewImgModalOpen(true)}
							className='cursor-pointer'
						>
							<SuperAvatar src={_user.avatar} />
						</div>
						<div className='mt-2'>
							<div>
								<Typography className='text-xl font-bold'>
									@{_user.username}
								</Typography>
							</div>
							<div>
								<span className='mr-2 select-none cursor-pointer hover:underline text-blue-400'>
									{intFormatter(_user?.followers?.length)} Followers
								</span>
								<span className='mr-2 select-none cursor-pointer hover:underline text-blue-400'>
									{intFormatter(_user?.following?.length)} Following
								</span>
							</div>
							<div>
								<Typography className='text-lg'>{_user.name}</Typography>
								<p>{_user.story}</p>
							</div>
							{auth.token ? (
								auth.user._id === _user._id && (
									<Button className='w-full' type='primary'>
										Edit Profile
									</Button>
								)
							) : (
								<Link href={`/login?next=/profile/${username}`}>
									<Button type='primary'>Login to see profile actions</Button>
								</Link>
							)}
						</div>
					</div>
					<ImageModal
						isOpen={isViewImgModalOpen}
						onClose={() => setIsViewImgModalOpen(false)}
						src={_user.avatar}
					/>
				</>
			))}
		</div>
	);
}
