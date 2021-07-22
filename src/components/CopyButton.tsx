import React, { FC, ReactNode } from 'react';
import { Button, ButtonProps, IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

interface CopyButtonProps {
	children?: ReactNode;
	buttonProps: ButtonProps;
	targetElementId: string;
}

export const CopyButton: FC<CopyButtonProps> = ( props: CopyButtonProps ) => {
	const handleClick = () => {
		const copyText: HTMLInputElement = document.getElementById( props.targetElementId ) as HTMLInputElement;
		copyText.select();
		document.execCommand( 'copy' );
	};
	return props.children
		?
		<Button {...props.buttonProps}
			endIcon={<FileCopyIcon />}
			onClick={() => handleClick()}>
			{props.children}
		</Button>
		:
		<IconButton
			color={props.buttonProps.color}
			onClick={() => handleClick()} >
			<FileCopyIcon />
		</IconButton>;
}