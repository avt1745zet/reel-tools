import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/regular';

import { Header } from './components/Header';
import { EncryptArea } from './components/EncryptArea';
import { DecryptArea } from './components/DecryptArea';
import { ReelConvertArea } from './components/ReelConverter';
import { RNGToolGenerator } from './components/RNGToolGenerator';

import favicon from './res/favicon/favicon_512.png';

const App: React.FC = () => (
	<div className='container-fluid'>
		<HelmetProvider>
			<Helmet >
				<title>Reel Tools</title>
				<link rel="icon" type="image/x-icon" href={favicon}></link>
			</Helmet>
		</HelmetProvider>
		<Header />
		<nav>
			<div className="nav nav-tabs" id="nav-tab" role="tablist">
				<button className="nav-link active" id="nav-convert-tab" data-bs-toggle="tab" data-bs-target="#nav-convert" type="button" role="tab" aria-controls="nav-convert" aria-selected="true">Convert</button>
				<button className="nav-link" id="nav-crypto-tab" data-bs-toggle="tab" data-bs-target="#nav-crypto" type="button" role="tab" aria-controls="nav-crypto" aria-selected="false">Crypto</button>
				<button className="nav-link" id="nav-rngtool-tab" data-bs-toggle="tab" data-bs-target="#nav-rngtool" type="button" role="tab" aria-controls="nav-rngtool" aria-selected="false">Rng Tool</button>
			</div>
		</nav>
		<div className="tab-content" id="nav-tabContent">
			<div className="tab-pane fade show active" id="nav-convert" role="tabpanel" aria-labelledby="nav-convert-tab">
				<div className='row'>
					<ReelConvertArea />
				</div>
			</div>
			<div className="tab-pane fade" id="nav-crypto" role="tabpanel" aria-labelledby="nav-crypto-tab">
				<div className='row'>
					<EncryptArea />
					<DecryptArea />
				</div>
			</div>
			<div className="tab-pane fade" id="nav-rngtool" role="tabpanel" aria-labelledby="nav-rngtool-tab">
				<RNGToolGenerator />
			</div>
		</div>
	</div>
);

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById( 'root' )
);
