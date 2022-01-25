import { Stack } from '.';
import MainTab from './MainTab';
import { colors, Image } from 'react-native-elements';
import FavSubjects from '../Screens/FavSubjects';
import NewQuestion from '../Screens/Main/NewQuestion';
import AdditionalConfigsQ from '../Screens/Main/AdditionalConfigsQ';
import ViewQuestion from '../Screens/Main/ViewQuestion';
import AnswerQuestion from '../Screens/Main/AnswerQuestion';
import MyQuestions from '../Screens/Main/MyQuestions';
import NotificationButton from '../Components/NotificationButton';
import Notifications from '../Screens/Main/Notifications';
export default function MainStack() {
	return (
		<Stack.Navigator initialRouteName='MainTab'>
			<Stack.Screen
				name='MainTab'
				options={({ navigation }) => ({
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
					headerRight: () => <NotificationButton navigation={navigation} />,
				})}
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
			<Stack.Screen
				name='Answer'
				component={AnswerQuestion}
				options={({ route }) => ({
					headerTitle:
						route.params.question.title.length < 30
							? route.params.question.title
							: route.params.question.title.slice(0, 30) + '.....',
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				})}
			/>
			<Stack.Screen
				name='MyQuestion'
				component={MyQuestions}
				options={{
					headerTitle: 'My Questions',
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
			<Stack.Screen
				component={Notifications}
				name='Notification'
				options={{
					headerTitle: 'My Notifications',
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
				}}
			/>
		</Stack.Navigator>
	);
}
