import Tables from './Screens/Tables';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Auth from './Screens/Auth';
import { useEffect } from 'react';
import { useAuthProvider } from './context/Auth';
function App() {
	const { setUser, setIsOwner, user } = useAuthProvider();
	useEffect(() => {
		async function authUser() {
			const storage = await window.sessionStorage.getItem('authUser');
			if (!storage) return;
			const user = JSON.parse(storage);
			setUser(user.ph);
			setIsOwner(user.owner);
		}
		authUser();
	}, [setIsOwner, setUser]);
	return (
		<>
			<BrowserRouter>
				<Switch>
					<Route path='/' exact component={user ? Tables : Auth} />
					<Redirect to='/' />
				</Switch>
			</BrowserRouter>
		</>
	);
}

export default App;
