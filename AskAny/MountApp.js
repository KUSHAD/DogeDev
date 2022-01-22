import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './Navigation/AuthStack';
import MainStack from './Navigation/MainStack';
import { useEffect } from 'react';
import { useAuthProvider } from './Providers/AuthProvider';

export default function MountApp() {
	const { isLoggedIn } = useAuthProvider();

	return (
		<SafeAreaProvider>
			<StatusBar style='auto' />
			<NavigationContainer>
				{isLoggedIn ? <MainStack /> : <AuthStack />}
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
