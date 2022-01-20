import { Stack } from '.';
import MainTab from './MainTab';
import { colors, Image } from 'react-native-elements';
import FavSubjects from '../Screens/FavSubjects';
import NewQuestion from '../Screens/Main/NewQuestion';
import AdditionalConfigsQ from '../Screens/Main/AdditionalConfigsQ';
import ViewQuestion from '../Screens/Main/ViewQuestion';
export default function MainStack() {
	return (
		<Stack.Navigator initialRouteName='MainTab'>
			<Stack.Screen
				name='MainTab'
				options={{
					title: ` AskAny DogeDev`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
					headerLeft: () => (
						<Image
							source={require('../assets/favicon.png')}
							style={{ height: 50, width: 50 }}
						/>
					),
				}}
				component={MainTab}
			/>
			<Stack.Screen
				name='FavSubjects'
				component={FavSubjects}
				options={{
					title: `Subjects Selections`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
			<Stack.Screen
				name='AddQuestion'
				component={NewQuestion}
				options={{
					title: `New Question`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
			<Stack.Screen
				name='ViewQuestion'
				component={ViewQuestion}
				options={({ route }) => ({
					headerTitle: `${route.params.title}`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				})}
			/>
			<Stack.Screen
				name='AdditionalConfigsQ'
				component={AdditionalConfigsQ}
				options={{
					title: `Additional Question Requirements`,
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
		</Stack.Navigator>
	);
}
