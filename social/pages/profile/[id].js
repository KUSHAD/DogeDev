import { useSelector } from 'react-redux';
import Profile from '../../containers/Profile';
import AuthLoading from '../../containers/AuthLoading';
import Head from 'next/head';
import connectDB from '../../utils/connectDB';
import Users from '../../models/user';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProfileLoading from '../../containers/ProfileLoading';

export default function ProfilePage({ user }) {
	const { authLoading } = useSelector(state => state);
	const [_user, set_User] = useState(user);
	useEffect(() => {
		const __user = JSON.parse(user);
		set_User(__user);
	}, [user]);
	const router = useRouter();
	if (router.isFallback) return <ProfileLoading />;
	return authLoading ? (
		<AuthLoading />
	) : (
		<>
			<Head>
				<title>{`${_user.name} @(${_user.username})`} | DDSocial</title>
			</Head>
			<Profile />
		</>
	);
}

export async function getStaticPaths() {
	await connectDB();
	const users = await Users.find({});
	const paths = users.map(_user => ({ params: { id: _user._id.toString() } }));
	return {
		paths: paths,
		fallback: true,
	};
}

export async function getStaticProps({ params: { id } }) {
	await connectDB();
	const user = await Users.findById(id).select('-password');

	if (!user)
		return {
			notFound: true,
		};

	return {
		props: {
			user: JSON.stringify({ ...user._doc, password: '' }),
		},
		revalidate: 10,
	};
}
