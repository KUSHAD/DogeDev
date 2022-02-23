import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class AppDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta
						name='description'
						content='A social media app created by DogeDev(Kushad Chakraborty)'
					/>
					<link rel='icon' href='/favicon.ico' />
					<link
						rel='stylesheet'
						href='https://fonts.googleapis.com/icon?family=Material+Icons'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
