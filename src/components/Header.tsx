import React from 'react';
import packageJson from '../../package.json';

export const Header: React.FC = () => {
	return <div className='row'>
		<div className='col-md-2 col-sm-12'>

		</div>
		<div className='col-md-8 col-sm-12'>
			<Title />
		</div>
		<div className='col-md-2 col-sm-12'>
			<Version />
		</div>
	</div>
};

const Title: React.FC = () => {
	return <h1 className='text-center'>
		Reel Tools
	</h1>
};

const Version: React.FC = () => {
	return <div className='text-md-end text-sm-center'>
		Version: {packageJson.version}
	</div>
};