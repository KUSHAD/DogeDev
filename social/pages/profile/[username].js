import { useSelector } from 'react-redux';
import Profile from '../../containers/Profile';
import AuthLoading from '../../containers/AuthLoading';
import Head from 'next/head';
import connectDB from '../../utils/connectDB';
import Users from '../../models/user';
import NotFound from '../../containers/NotFound';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProfilePage({ user, notFound }) {
	const { authLoading } = useSelector(state => state);
	const [_user, set_User] = useState(user);
	useEffect(() => {
		const __user = JSON.parse(user);
		set_User(__user);
	}, [user]);
	const router = useRouter();
	if (router.isFallback) return <AuthLoading />;
	return authLoading ? (
		<AuthLoading />
	) : notFound ? (
		<NotFound />
	) : (
		<>
			<Head>
				<title>{`${_user.name} @(${_user.username})`} | DDSocial</title>
			</Head>
			<Profile user={_user} />
		</>
	);
}

export async function getStaticPaths() {
	await connectDB();
	const users = await Users.find({});
	const paths = users.map(_user => ({ params: { username: _user.username } }));
	return {
		paths: paths,
		fallback: true,
	};
}

export async function getStaticProps({ params: { username } }) {
	await connectDB();
	const user = await Users.findOne({ username: username }).select('-password');
	if (!user)
		return {
			props: {
				notFound: true,
			},
		};

	return {
		props: {
			user: JSON.stringify(user),
			notFound: false,
		},
	};
}
