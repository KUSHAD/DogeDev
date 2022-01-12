import { Tab } from '.';
import Home from '../Screens/Main/Home';

export default function MainTab() {
	return (
		<Tab.Navigator initialRouteName='Home'>
			<Tab.Screen name='Home' component={Home} />
		</Tab.Navigator>
	);
}
