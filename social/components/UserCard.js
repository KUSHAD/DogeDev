import { Typography } from 'antd';
import MediumAvatar from './Avatar/Medium';
import Link from 'next/link';

export default function UserCard({ user, onClose }) {
	return (
		<div
			onClick={onClose}
			className='bg-white border-b cursor-pointer border-gray-200 hover:bg-slate-50'
		>
			<Link href={`/profile/${user._id}`}>
				<div className='flex flex-row p-1'>
					<MediumAvatar src={user.avatar} />
					<div className='flex flex-col ml-1'>
						<Typography className='text-lg'>{user.name}</Typography>@
						{user.username}
					</div>
				</div>
			</Link>
		</div>
	);
}
