import SmallAvatar from '../Avatar/Small';
import { useSelector } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function NavItems() {
	const navLinks = [
		{ icon: 'home', path: '/' },
		{ icon: 'near_me', path: '/chats' },
		{ icon: 'explore', path: '/explore' },
	];
	const { auth } = useSelector(state => state);
	const { pathname } = useRouter();

	function isActive(pn) {
		if (pn === pathname) return 'opacity-100';
		return 'opacity-50';
	}

	return (
		<div className='flex flex-row justify-between md:mt-4'>
			{navLinks.map(nav => (
				<Link href={nav.path} key={nav.path}>
					<i
						className={`material-icons cursor-pointer md:mx-2 hover:opacity-75 ${isActive(
							nav.path
						)}`}
					>
						{nav.icon}
					</i>
				</Link>
			))}
			<i className='material-icons cursor-pointer md:mx-2'>favorite</i>
			<Dropdown
				arrow
				overlay={ProfileMenu}
				trigger={['click']}
				placement='bottomRight'
			>
				<div
					className='ant-dropdown-link cursor-pointer md:mx-2'
					onClick={e => e.preventDefault()}
				>
					<SmallAvatar src={auth.user.avatar} />
				</div>
			</Dropdown>
		</div>
	);
}

function ProfileMenu() {
	return (
		<Menu className='w-24'>
			<Menu.Item key={0}>Profile</Menu.Item>
			<Menu.Item key={1} danger>
				Logout
			</Menu.Item>
		</Menu>
	);
}
