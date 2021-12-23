import { createContext, useState, useContext } from 'react';
import constants from '../constants';

const Auth = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState();
	const [userPerms, setUserPerms] = useState(constants.USER_PERMS.TEST);
	const value = {
		user,
		setUser,
		userPerms,
		setUserPerms,
	};
	return <Auth.Provider value={value}>{children}</Auth.Provider>;
}

export function useAuthProvider() {
	return useContext(Auth);
}
