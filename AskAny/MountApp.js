import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './Navigation/AuthStack';
import MainStack from './Navigation/MainStack';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useAuthProvider } from './Providers/AuthProvider';
import Container from './Components/Container';
import { colors } from 'react-native-elements';

export default function MountApp() {
	const { getUserLoginStatus, isLoggedIn, isLoading } = useAuthProvider();
	useEffect(() => {
		getUserLoginStatus();
	}, []);
	return (
		<SafeAreaProvider>
			<StatusBar style='auto' />
			<NavigationContainer>
				{isLoading ? (
					<Container>
						<ActivityIndicator color={colors.primary} size='large' />
					</Container>
				) : isLoggedIn ? (
					<MainStack />
				) : (
					<AuthStack />
				)}
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
