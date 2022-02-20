import '../styles/global.css';
import 'antd/dist/antd.css';
import DataProvider from '../redux/store';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
	return (
		<DataProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</DataProvider>
	);
}

export default MyApp;
