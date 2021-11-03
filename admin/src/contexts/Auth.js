import { createContext, useState, useContext } from 'react';

const Auth = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState();
	const value = {
		user,
		setUser,
	};
	return <Auth.Provider value={value}>{children}</Auth.Provider>;
}

export function useAuthProvider() {
	return useContext(Auth);
}
