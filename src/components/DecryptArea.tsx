import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { CryptoHelper } from './CryptoHelper';

interface ResultProps {
	message: string;
}

interface CausionProps {
	isLegalFormat: boolean;
}

let decryptText = '';

export const DecryptArea: React.FC = () => {
	const [ message, setMessage ] = useState( '' );
	const [ isLegalFormat, setIsLegalFormat ] = useState( true );
	return <form className='col-md-6 col-sm-12'>
		<label>
			Decrypt
		</label>
		<input id='decryptInput' className='form-control' placeholder='Enter any encrypt string' onChange={( event ) => {
			decryptText = event.target.value;
		}}></input>
		<button type='button' className='btn btn-primary col-12' onClick={() => {
			try {
				const decryptObject = CryptoHelper.decrypt<JSON>( decryptText );
				if ( decryptObject ) {
					setMessage( JSON.stringify( decryptObject ) );
					setIsLegalFormat( true );
				} else {
					setMessage( '' );
					setIsLegalFormat( false );
				}
			} catch {
				setMessage( '' );
				setIsLegalFormat( false );
			}
		}}> Start Decrypt </button >
		<Causion isLegalFormat={isLegalFormat} />
		<Result message={message} />
	</form>
};

const Causion: React.FC<CausionProps> = ( props: CausionProps ) => {
	if ( !props.isLegalFormat ) {
		return <p className='text-danger'>Your format of input encrypted text is not correct!!</p>
	} else {
		return null;
	}
};

const Result: React.FC<ResultProps> = ( props: ResultProps ) => {
	return <div className='form-group row'>
		<div className='col-11'>
			<input id='decryptResult' className='form-control' value={props.message} readOnly></input>
		</div>
		<CopyButton style='btn btn-light col-1' targetElementId='decryptResult' />
	</div>
}