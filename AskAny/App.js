import MountApp from './MountApp';
import Providers from './Providers';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();
export default function App() {
	return (
		<Providers>
			<MountApp />
		</Providers>
	);
}
