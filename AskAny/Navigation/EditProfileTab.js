import { TopTab } from '.';
import Name from '../Screens/EditProfile/Name';
import { colors } from 'react-native-elements';
import Email from '../Screens/EditProfile/Email';
import Password from '../Screens/EditProfile/Password';
import Avatar from '../Screens/EditProfile/Avatar';

export default function EditProfileTab() {
	return (
		<TopTab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: colors.primary,
				},
				tabBarActiveTintColor: colors.white,

				tabBarIndicatorStyle: {
					height: 5,
					backgroundColor: colors.white,
				},
				tabBarLabelStyle: {
					fontWeight: 'bold',
				},
			}}
			initialRouteName='EditName'
		>
			<TopTab.Screen
				name='EditName'
				component={Name}
				options={{ title: 'Update Name' }}
			/>
			<TopTab.Screen
				name='EditEmail'
				component={Email}
				options={{ title: 'Update Email' }}
			/>
			<TopTab.Screen
				name='EditPass'
				component={Password}
				options={{ title: 'Update Password' }}
			/>
			<TopTab.Screen
				name='EditAvatar'
				component={Avatar}
				options={{ title: 'Update Avatar' }}
			/>
		</TopTab.Navigator>
	);
}
