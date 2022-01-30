import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import {
	Avatar,
	Card,
	ListItem,
	Text,
	Icon,
	Button,
	colors,
} from 'react-native-elements';
import { useAuthProvider } from '../../Providers/AuthProvider';
import ImageModal from '../../Components/ImageModal';

export default function Profile({ navigation }) {
	const [showImage, setShowImage] = useState(false);
	const { authUser, logout, isLoading } = useAuthProvider();
	return (
		<>
			<Card>
				<SafeAreaView style={{ flexDirection: 'row' }}>
					<Avatar
						size='large'
						source={{ uri: authUser.avatar }}
						onPress={() => setShowImage(true)}
					/>
					<SafeAreaView
						style={{ flexDirection: 'column', marginTop: 5, margin: 5 }}
					>
						<Text h4>{authUser.name}</Text>
						<Text h4>{authUser.email}</Text>
					</SafeAreaView>
				</SafeAreaView>
				<Button
					onPress={logout}
					loading={isLoading}
					title='Logout'
					icon={<Icon name='logout' color={colors.white} />}
					raised
					containerStyle={{
						marginTop: 10,
					}}
					buttonStyle={{
						backgroundColor: colors.error,
					}}
				/>
			</Card>
			<SafeAreaView style={{ width: `95%`, marginStart: `2.5%` }}>
				<ListItem
					topDivider
					bottomDivider
					onPress={() =>
						navigation.navigate('EditProfile', {
							name: authUser.name,
							email: authUser.email,
						})
					}
				>
					<ListItem.Title>
						<Icon name='person' />
						Update Profile
					</ListItem.Title>
				</ListItem>
				<ListItem
					topDivider
					bottomDivider
					onPress={() => navigation.navigate('FavSubjects')}
				>
					<ListItem.Title>
						<Icon name='book' />
						My Favourite subjects
					</ListItem.Title>
				</ListItem>
				<ListItem
					topDivider
					bottomDivider
					onPress={() => navigation.navigate('MyQuestion')}
				>
					<ListItem.Title>
						<Icon name='receipt' />
						My Questions
					</ListItem.Title>
				</ListItem>
			</SafeAreaView>
			<ImageModal
				imgUri={authUser.avatar}
				isOpen={showImage}
				onDismiss={() => setShowImage(false)}
			/>
		</>
	);
}
