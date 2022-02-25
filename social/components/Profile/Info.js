import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SuperAvatar from '../Avatar/Super';
import { Typography, Button } from 'antd';
import intFormatter from '../../utils/intFormatter';
import { useRouter } from 'next/router';
import { getProfileUsers } from '../../redux/actions/profile.action';
import ImageModal from '../ImageModal';
export default function Info() {
	const [userData, setUserData] = useState([]);
	const [isViewImgModalOpen, setIsViewImgModalOpen] = useState(false);
	const { auth, profile } = useSelector(state => state);
	const dispatch = useDispatch();
	const {
		query: { id },
	} = useRouter();
	useEffect(() => {
		if (id === auth.user._id) {
			setUserData([auth.user]);
		} else {
			dispatch(getProfileUsers({ users: profile.users, id, auth }));
			const newData = profile.users.filter(user => user._id === id);
			setUserData(newData);
		}
	}, [id, auth.user, dispatch, profile.users]);
	return (
		<div className='mt-2'>
			{userData.map(_user => (
				<>
					<div
						key={_user._id}
						className='flex flex-col md:flex-row w-full justify-center'
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
									{intFormatter(_user.followers.length)} Followers
								</span>
								<span className='mr-2 select-none cursor-pointer hover:underline text-blue-400'>
									{intFormatter(_user.following.length)} Following
								</span>
							</div>
							<div>
								<Typography className='text-lg'>{_user.name}</Typography>
								<p>{_user.story}</p>
							</div>
							{auth.user._id === _user._id && (
								<Button className='w-full' type='primary'>
									Edit Profile
								</Button>
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
