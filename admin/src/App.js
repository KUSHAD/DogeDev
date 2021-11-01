import Header from "./components/Header";
import Private from "./screens/Private";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Auth from "./screens/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Alert from "react-bootstrap/Alert";
import { useFetchMaster } from "./contexts/FetchMaster";
import Button from "react-bootstrap/Button";
import Loading from "./components/Loading";
import { useEffect } from "react";
import { useAuthProvider } from "./contexts/Auth";

function App() {
  const { error, fetchFields, isLoading, fetchStudents } = useFetchMaster();
  const { setUser } = useAuthProvider();
  useEffect(() => {
    async function get() {
      await fetchFields();
      await fetchStudents();
    }
    get();
  }, [fetchFields, fetchStudents, setUser]);
  return (
    <>
      <Header />
      <Loading isOpen={isLoading} />
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="info"
            onClick={() => window.location.reload()}
            className="w-100 mt-2"
          >
            Refresh Page
          </Button>
        </Alert>
      )}
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/" exact component={Private} />
          <Route path="/auth" component={Auth} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
