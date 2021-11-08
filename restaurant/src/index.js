import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import Providers from './context';
import './index.css';

render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
	document.getElementById('root')
);
