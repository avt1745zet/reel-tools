import React, { FC, Fragment, useState } from 'react';
import { Box, Button, createStyles, makeStyles, TextField, Typography } from '@material-ui/core';
import { CopyButton } from '../../../components/buttons/CopyButton';
import { CryptoHelper } from '../../../utils/CryptoHelper';

interface ResultProps {
	message: string;
}

interface CausionProps {
	isLegalFormat: boolean;
}

let decryptText = '';

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		}
	} )
);

export const DecryptArea: FC = () => {
	const [ message, setMessage ] = useState( '' );
	const [ isLegalFormat, setIsLegalFormat ] = useState( true );

	const classes = useStyles();
	return <form className={classes.root} >
		<TextField
			fullWidth
			InputLabelProps={{
				shrink: true,
			}}
			label='Decrypt'
			placeholder='Enter any encrypt string'
			onChange={( event ) => {
				decryptText = event.target.value;
			}}
		/>
		<Button
			fullWidth
			color='primary'
			variant='contained'
			onClick={() => {
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
			}}>
			Start Decrypt
		</Button>
		<Causion isLegalFormat={isLegalFormat} />
		<Result message={message} />
	</form>
};

const Causion: FC<CausionProps> = ( props: CausionProps ) => {
	const { isLegalFormat } = props;

	if ( !isLegalFormat ) {
		return (
			<Typography
				color='error'
				variant='body1'
			>
				Your format of input encrypted text is not correct!!
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
				id='decryptResult'
				value={message}
			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='decryptResult'
			/>
		</Box>
	)
}