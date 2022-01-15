import MountApp from './MountApp';
import Providers from './Providers';
import 'react-native-gesture-handler';

export default function App() {
	return (
		<Providers>
			<MountApp />
		</Providers>
	);
}
