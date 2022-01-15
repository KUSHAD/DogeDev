import { colors, Icon, Avatar } from 'react-native-elements';
import { Tab } from '.';
import Home from '../Screens/Main/Home';
import NewQuestion from '../Screens/Main/NewQuestion';
import Profile from '../Screens/Main/Profile';

export default function MainTab({ navigation }) {
	return (
		<Tab.Navigator
			initialRouteName='Home'
			barStyle={{ backgroundColor: colors.primary }}
			labeled={false}
		>
			<Tab.Screen
				name='Home'
				component={Home}
				options={{
					tabBarIcon: ({ color }) => <Icon name='home' color={color} />,
				}}
			/>
			<Tab.Screen
				name='AddQuestion'
				component={NewQuestion}
				listeners={{
					tabPress: e => {
						e.preventDefault();
						navigation.navigate('AddQuestion');
					},
				}}
				options={{
					tabBarIcon: ({ color }) => <Icon name='add' color={color} />,
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={Profile}
				options={{
					tabBarIcon: ({ color }) => <Icon name='person' color={color} />,
				}}
			/>
		</Tab.Navigator>
	);
}
