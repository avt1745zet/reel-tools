import React, { FC } from 'react';
import { createStyles, Divider, makeStyles } from '@material-ui/core';
import { DecryptArea } from './DecryptArea';
import { EncryptArea } from './EncryptArea';

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

export const JsonCryptor: FC = () => {
	const classes = useStyles();
	return (
		<React.Fragment>
			<EncryptArea />
			<Divider className={classes.divider} />
			<DecryptArea />
		</React.Fragment>
	);
};