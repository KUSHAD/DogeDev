import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SuperAvatar from '../Avatar/Super';
import { Typography, Button } from 'antd';
import intFormatter from '../../utils/intFormatter';
import { getProfileUsers } from '../../redux/actions/profile.action';
import ImageModal from '../ImageModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EditProfile from './EditProfile';
export default function Info({ user }) {
	const [userData, setUserData] = useState([]);
	const [isViewImgModalOpen, setIsViewImgModalOpen] = useState(false);
	const [editProfileModal, setEditProfileModal] = useState(false);
	const { auth, profile } = useSelector(state => state);
	const dispatch = useDispatch();
	const {
		query: { username },
	} = useRouter();

	useEffect(() => {
		if (auth.token) {
			if (username === auth.user.username) {
				setUserData([auth.user]);
			} else {
				dispatch(getProfileUsers({ users: profile.users, username }));
				const newData = profile.users.filter(_user => _user._id === user._id);
				setUserData(newData);
			}
		} else {
			dispatch(getProfileUsers({ users: profile.users, username }));
			const newData = profile.users.filter(_user => _user._id === user._id);
			setUserData(newData);
		}
	}, [username, auth.user, dispatch, profile.users]);
	return (
		<>
			<div>
				{userData.map(_user => (
					<Fragment key={_user._id}>
						<div className='flex flex-col md:flex-row w-full md:max-w-lg justify-between m-auto'>
							<div
								onClick={() => setIsViewImgModalOpen(true)}
								className='cursor-pointer'
							>
								<SuperAvatar src={_user.avatar} />
							</div>
							<div className='mt-2 md:max-w-xs'>
								<div>
									<Typography className='text-2xl font-bold'>
										@{_user.username}
									</Typography>
								</div>
								<div className='text-lg'>
									<span className='mr-2 select-none cursor-pointer hover:underline text-blue-400'>
										{intFormatter(_user?.followers?.length)} Followers
									</span>
									<span className='mr-2 select-none cursor-pointer hover:underline text-blue-400'>
										{intFormatter(_user?.following?.length)} Following
									</span>
								</div>
								<div>
									<Typography className='text-lg'>{_user.name}</Typography>
									<p className='text-sm'>{_user.story}</p>
								</div>
								{auth.token ? (
									auth.user._id === _user._id && (
										<Button
											onClick={() => setEditProfileModal(true)}
											className='w-full'
											type='primary'
										>
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
					</Fragment>
				))}
			</div>
			<EditProfile
				isOpen={editProfileModal}
				onClose={() => setEditProfileModal(false)}
			/>
		</>
	);
}
