import { TouchableOpacity } from 'react-native';
import { Icon, colors } from 'react-native-elements';
export default function NotificationButton({ navigation }) {
	function onPress() {
		navigation.navigate('Search');
	}
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flexDirection: 'row',
			}}
		>
			<Icon name='search' color={colors.white} />
		</TouchableOpacity>
	);
}
