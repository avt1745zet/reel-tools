import React, { FC } from 'react';
import { Box, createStyles, Divider, makeStyles } from '@material-ui/core';
import { DecryptArea } from './components/DecryptArea';
import { EncryptArea } from './components/EncryptArea';

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

const JsonFormatCryptor: FC = () => {
	const classes = useStyles();
	return (
		<Box>
			<EncryptArea />
			<Divider className={classes.divider} />
			<DecryptArea />
		</Box>
	);
};

export default JsonFormatCryptor;