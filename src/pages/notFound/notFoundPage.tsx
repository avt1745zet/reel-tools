import React, { FC } from 'react';
import { Box, Typography } from '@material-ui/core';

const NotFoundPage: FC = () => {
	return (
		<Box>
			<Typography variant='h2'>
				ERROR 404
			</Typography >
			<Typography variant='body1'>
				This page not found :(
			</Typography >
		</Box>
	);
}

export default NotFoundPage;