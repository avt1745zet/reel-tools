import React, { FC, Fragment, useState } from 'react';
import { createStyles, Divider, makeStyles, TextField, Typography } from '@material-ui/core';
import { CopyButton } from './CopyButton';

interface ResultProps {
	message: string;
}

interface CausionProps {
	isLegalFormat: boolean;
}

const placeholder = `WILD	WILD	WILD
WILD	WILD	WILD
WILD	WILD	WILD
PIC3	PIC2	Q
PIC3	PIC2	Q
PIC3	PIC2	Q
PIC1	PIC3	PIC2
PIC1	PIC3	PIC2
PIC1	PIC3	PIC2
PIC1	Q	K
Q	Q	K
PIC3	Q	K
PIC3	A	PIC2
PIC3	A	A
A	A	SCATTER
SCATTER	Q	PIC2
PIC3	Q	A
A	Q	Q
PIC1	SCATTER	Q
PIC1	Q	Q
PIC1	Q	PIC2
K	Q	PIC2
K	Q	PIC2
K	PIC2	K
K	PIC2	K
PIC2	PIC2	K
PIC1	PIC3	PIC2
K	PIC3	PIC2
SCATTER	PIC3	PIC2
PIC1	A	PIC2
K	A	A
K	A	A
K	Q	A
K	Q	A
PIC3	Q	SCATTER
PIC3	PIC2	A
PIC3	PIC3	A
PIC1	SCATTER	A
PIC1	PIC2	PIC3
PIC1	PIC3	PIC3
PIC1	PIC3	PIC3
A	PIC3	Q
A	Q	Q
A	Q	Q
A	Q	Q
PIC1	Q	Q
PIC1	PIC2	PIC2
PIC1	PIC2	PIC2
K	PIC2	PIC2
K	Q	PIC1
K	Q	A
PIC2	Q	A
A	K	A
A	K	PIC2
A	K	PIC2
A	SCATTER	PIC2
K	K	Q
SCATTER	K	SCATTER
A	K	PIC2
K	K	Q
PIC1	K	A
PIC1	K	A
PIC1	PIC2	A
PIC1	PIC3	A
A	PIC3	PIC2
A	PIC3	PIC2
A	PIC1	PIC2
A	PIC1	Q
A	PIC1	Q
PIC1	Q	Q
K	Q	PIC1
SCATTER	Q	PIC1
PIC1	Q	PIC1
K	PIC2	A
Q	SCATTER	A
Q	Q	A
Q	PIC2	A
K	PIC3	Q
K	PIC3	SCATTER
K	PIC3	A
Q	Q	Q
PIC3	Q	PIC1
SCATTER	Q	PIC1
Q	K	PIC1
PIC3	K	PIC1
PIC1	K	PIC3
PIC1	PIC3	PIC3
PIC1	PIC3	PIC3
PIC2	PIC3	PIC2
PIC2	PIC3	PIC2
PIC2	PIC1	PIC2
PIC1	A	K
PIC1	A	K
PIC1	A	K
K	PIC1	K
K	PIC3	PIC2
K	PIC3	PIC2
K	PIC3	PIC2
PIC2	PIC3	PIC2
PIC3	PIC3	PIC2
PIC3	PIC3	SCATTER
PIC3	SCATTER	PIC2
PIC3	PIC3	PIC2
K	PIC3	PIC2
K	PIC3	PIC2
K	PIC3	PIC2
K	PIC2	PIC2
PIC1	Q	A
PIC1	Q	A
PIC1	Q	A
PIC3	PIC3	A
PIC3	PIC3	A
PIC3	PIC3
PIC3	PIC3`;

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		divider: {
			marginBlock: '30px',
			height: 0
		}
	} )
);

export const ReelConvertArea: FC = () => {
	const [ convertString, setConvertString ] = useState( '' );
	const [ isLegalFormat, setIsLegalFormat ] = useState( true );

	const classes = useStyles();

	return (
		<form className={classes.root} >
			<TextField
				fullWidth
				multiline
				rows={15}
				InputLabelProps={{
					shrink: true,
				}}
				label='Reel Strips'
				placeholder={placeholder}
				onChange={( event ) => {
					const input = event.target.value;
					try {
						if ( !input ) {
							setConvertString( '' );
						}

						const lines: Array<string> = input.split( '\n' );
						const reelCount: number = lines[ 0 ].split( '\t' ).length;
						const converted: Array<Array<string>> = [];
						for ( let col = 0; col < reelCount; col++ ) {
							const convertedReel: Array<string> = [];
							lines.forEach( function ( row ) {
								const symbols = row.split( '\t' );
								if ( col < symbols.length && symbols[ col ].trim().length > 0 ) {
									convertedReel.push( symbols[ col ].trim() );
								}
							} );
							converted.push( convertedReel );
						}
						setConvertString( JSON.stringify( converted, null, 2 ) );
						setIsLegalFormat( true );
					} catch ( err ) {
						setIsLegalFormat( false );
					}
				}}
			/>
			<Causion isLegalFormat={isLegalFormat} />
			<Divider className={classes.divider} />
			<Result message={convertString} />
		</form>
	);
};

const Causion: FC<CausionProps> = ( props: CausionProps ) => {
	const { isLegalFormat } = props;

	if ( !isLegalFormat ) {
		return (
			<Typography
				color='error'
				variant={'body1'}
			>
				Reel strips format is illegal!
			</Typography >
		);
	} else {
		return <Fragment></Fragment>;
	}
};

const Result: FC<ResultProps> = ( props: ResultProps ) => {
	const { message } = props;

	return (
		<React.Fragment>
			<TextField
				fullWidth
				multiline
				rows={15}
				inputProps={{ readOnly: true }}
				label='Convert result'
				value={message}
				id='convertResult'

			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='convertResult'
			>
				Copy result
			</CopyButton>
		</React.Fragment>
	);
};