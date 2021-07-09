import React from 'react';

interface ICopyButtonProps {
	style: string;
	targetElementId: string;
}

export const CopyButton: React.FC<ICopyButtonProps> = ( props: ICopyButtonProps ) => {
	return <button type='button' className={props.style} onClick={() => {
		const copyText: HTMLInputElement = document.getElementById( props.targetElementId ) as HTMLInputElement;
		copyText.select();
		document.execCommand( 'copy' );
	}}><i className='far fa-copy' aria-hidden='true'></i></button>;
}