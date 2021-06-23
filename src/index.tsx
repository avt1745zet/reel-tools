import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/regular';

import { EncryptArea } from './components/EncryptArea';
import { DecryptArea } from './components/DecryptArea';
import { ReelConvertArea } from './components/ReelConverter';

const App: React.FC = () => (
	<div className='container-fluid'>
		<Title />
		<nav>
			<div className="nav nav-tabs" id="nav-tab" role="tablist">
				<button className="nav-link active" id="nav-convert-tab" data-bs-toggle="tab" data-bs-target="#nav-convert" type="button" role="tab" aria-controls="nav-convert" aria-selected="true">Convert</button>
				<button className="nav-link" id="nav-crypto-tab" data-bs-toggle="tab" data-bs-target="#nav-crypto" type="button" role="tab" aria-controls="nav-crypto" aria-selected="false">Crypto</button>
			</div>
		</nav>
		<div className="tab-content" id="nav-tabContent">
			<div className="tab-pane fade show active" id="nav-convert" role="tabpanel" aria-labelledby="nav-home-tab">
				<div className='row'>
					<ReelConvertArea />
				</div>
			</div>
			<div className="tab-pane fade row" id="nav-crypto" role="tabpanel" aria-labelledby="nav-profile-tab">
				<div className='row'>
					<EncryptArea />
					<DecryptArea />
				</div>
			</div>
		</div>
	</div>
);

const Title: React.FC = () => {
	document.title = 'Reel Tools';
	return <h1 className='text-center'>
		Reel Tools
	</h1>
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById( 'root' )
);
