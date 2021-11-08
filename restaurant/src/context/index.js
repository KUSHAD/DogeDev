import { AuthProvider } from './Auth';

export default function Providers({ children }) {
	return <AuthProvider>{children}</AuthProvider>;
}
