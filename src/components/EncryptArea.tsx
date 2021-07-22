import React, { FC, Fragment, useState } from 'react';
import { Box, Button, createStyles, makeStyles, TextField, Typography } from '@material-ui/core';
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

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		}
	} )
);

export const EncryptArea: FC = () => {
	const [ encryptString, setEncryptString ] = useState( '' );
	const [ isLegalFormat, setIsLegalFormat ] = useState( false );

	const classes = useStyles();
	return <form className={classes.root} >
		<TextField
			fullWidth
			multiline
			rows={16}
			InputLabelProps={{
				shrink: true,
			}}
			label='Encrypt'
			placeholder={placeholder}
			onChange={( event ) => {
				try {
					objectToEncrypt = JSON.parse( event.target.value );
					setIsLegalFormat( true );
				} catch {
					setIsLegalFormat( false );
				}
			}}
		/>
		<Button
			variant='contained'
			color='primary'
			fullWidth
			disabled={!isLegalFormat}
			onClick={() => {
				setEncryptString( CryptoHelper.encrypt( objectToEncrypt ) )
			}}>
			Start Encrypt
		</Button>
		<Causion isLegalFormat={isLegalFormat} />
		<Result message={encryptString} />
	</form>
};

const Causion: FC<CausionProps> = ( props: CausionProps ) => {
	const { isLegalFormat } = props;

	if ( !isLegalFormat ) {
		return (
			<Typography
				color='error'
				variant={'body1'}
			>
				.json format is illegal!
			</Typography >
		);
	} else {
		return <Fragment></Fragment>;
	}
};

const Result: FC<ResultProps> = ( props: ResultProps ) => {
	const { message } = props;

	return (
		<Box display='flex'>
			<TextField
				fullWidth
				inputProps={{ readOnly: true }}
				id='encryptResult'
				value={message}
			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='encryptResult'
			/>
		</Box>
	)
};
