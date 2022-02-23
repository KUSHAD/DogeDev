import '../styles/global.css';
import 'antd/dist/antd.css';
import DataProvider from '../redux/store';
import Layout from '../components/Layout';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
	return (
		<>
			<DataProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</DataProvider>
			<Script src='https://kit.fontawesome.com/328dcb9b3c.js' />
		</>
	);
}
