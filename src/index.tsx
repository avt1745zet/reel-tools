import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { App } from './App';

import favicon from './res/favicon/favicon_512.png';

ReactDOM.render(
	<React.StrictMode>
		<HelmetProvider>
			<Helmet >
				<title>Reel Tools</title>
				<link rel='icon' type='image/x-icon' href={favicon}></link>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"></meta>
			</Helmet>
		</HelmetProvider>
		<App />
	</React.StrictMode>,
	document.getElementById( 'root' )
);
