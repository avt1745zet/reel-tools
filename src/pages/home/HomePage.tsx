import React, { FC } from 'react';
import { Box, Typography } from '@material-ui/core';

const HomePage: FC = () => {
	return (
		<Box>
			<Typography variant='h2'>
				Home
			</Typography >
			<Typography variant='body1'>
				This page is still under development...
			</Typography >
		</Box>
	);
}

export default HomePage;