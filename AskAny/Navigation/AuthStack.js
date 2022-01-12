import { Stack } from '.';
import ForgotPass from '../Screens/Auth/ForgotPass';
import Login from '../Screens/Auth/Login';
import Signup from '../Screens/Auth/Signup';

export default function AuthStack() {
	return (
		<Stack.Navigator initialRouteName='Login'>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name='Login'
				component={Login}
			/>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name='Signup'
				component={Signup}
			/>
			<Stack.Screen
				name='ForgotPass'
				component={ForgotPass}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}
