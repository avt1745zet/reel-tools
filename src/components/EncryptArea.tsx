import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { CryptoHelper } from './CryptoHelper';

interface ResultProps {
	message: string;
}

interface CausionProps {
	isLegalFormat: boolean;
}

let objectToEncrypt: JSON;

const placeholder = `{
	"stripOrder": [
		"PIC1",
		"PIC2",
		"PIC3",
		"PIC4",
		"PIC5",
		"A",
		"K",
		"Q",
		"J",
		"T",
		"WILD",
		"SCATTER"
	]
}`;

export const EncryptArea: React.FC = () => {
	const [ encryptString, setEncryptString ] = useState( '' );
	const [ isLegalFormat, setIsLegalFormat ] = useState( true );
	return <form className='col-md-6 col-sm-12'>
		<label>
			Encrypt
		</label>
		<textarea className='form-control' placeholder={placeholder} rows={15} onChange={( event ) => {
			try {
				objectToEncrypt = JSON.parse( event.target.value );
				setIsLegalFormat( true );
			} catch {
				setIsLegalFormat( false );
			}
		}}></textarea>
		<button id='encryptButton' type='button' className='btn btn-primary col-12' disabled={!isLegalFormat} onClick={() => {
			setEncryptString( CryptoHelper.encrypt( objectToEncrypt ) )
		}}> Start Encrypt </button >
		<Causion isLegalFormat={isLegalFormat} />
		<Result message={encryptString} />
	</form>
};

const Causion: React.FC<CausionProps> = ( props: CausionProps ) => {
	if ( !props.isLegalFormat ) {
		return <p className='text-danger'>.json format is illegal!</p>
	} else {
		return null;
	}
};

const Result: React.FC<ResultProps> = ( props: ResultProps ) => {
	return <div className='form-group row'>
		<div className='col-11'>
			<input id='encryptResult' className='form-control' value={props.message} readOnly></input>
		</div>
		<CopyButton style='btn btn-light col-1' targetElementId='encryptResult' />
	</div>
};