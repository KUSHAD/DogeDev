import Tables from './Screens/Tables';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Auth from './Screens/Auth';
import { useEffect } from 'react';
import { useAuthProvider } from './context/Auth';
import { useFetchMaster } from './context/FetchMaster';
import PrivateRoute from './Components/PrivateRoute';
import Table from './Screens/Table';
import Alert from 'react-bootstrap/Alert';
import Loading from './Components/Loading';
import Button from 'react-bootstrap/Button';

function App() {
	const { error, isLoading, fetchMenu } = useFetchMaster();
	const { setUser, setIsOwner, user } = useAuthProvider();
	useEffect(() => {
		async function get() {
			await fetchMenu();
		}
		async function authUser() {
			const storage = await window.sessionStorage.getItem('authUser');
			if (!storage) return;
			const user = JSON.parse(storage);
			setUser(user.ph);
			setIsOwner(user.owner);
		}
		authUser();
		get();
	}, [fetchMenu, setIsOwner, setUser]);
	return (
		<>
			<Loading isOpen={isLoading} />
			{error && (
				<Alert variant='danger'>
					<Alert.Heading>Error</Alert.Heading>
					<p>{error}</p>
					<Button
						variant='info'
						onClick={() => window.location.reload()}
						className='w-100 mt-2'
					>
						Refresh Page
					</Button>
				</Alert>
			)}
			<BrowserRouter>
				<Switch>
					<Route path='/' exact component={user ? Tables : Auth} />
					<PrivateRoute path='/table/:id' component={Table} />

					<Redirect to='/' />
				</Switch>
			</BrowserRouter>
		</>
	);
}

export default App;
