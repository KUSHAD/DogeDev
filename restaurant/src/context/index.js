import { AuthProvider } from './Auth';
import { FetchMasterProvider } from './FetchMaster';

export default function Providers({ children }) {
	return (
		<AuthProvider>
			<FetchMasterProvider>{children}</FetchMasterProvider>
		</AuthProvider>
	);
}
