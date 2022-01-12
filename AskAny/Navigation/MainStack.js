import { Stack } from '.';
import MainTab from './MainTab';
import { colors } from 'react-native-elements';
import FavSubjects from '../Screens/FavSubjects';

export default function MainStack() {
	return (
		<Stack.Navigator initialRouteName='MainTab'>
			<Stack.Screen name='MainTab' component={MainTab} />
			<Stack.Screen
				name='FavSubjects'
				component={FavSubjects}
				options={{
					headerBackVisible: false,
					title: `Subjects Selections`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
		</Stack.Navigator>
	);
}
