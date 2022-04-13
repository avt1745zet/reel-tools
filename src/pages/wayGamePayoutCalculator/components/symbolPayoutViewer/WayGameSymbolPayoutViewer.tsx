import React, { FC, ReactElement } from 'react';
import { Box, createStyles, FormGroup, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { CommonProps, OverridableTypeMap } from '@material-ui/core/OverridableComponent';
import { IPayout } from '../../../../core/SlotGameDataInterfaces';

export interface SymbolPayoutViewerProps extends CommonProps<OverridableTypeMap> {
	symbolPayoutsMap: Map<string, Array<IPayout>>;
}

const useStyles = makeStyles( () =>
	createStyles( {
		formControlLabelWithAddButton: {
			marginRight: 0
		},
		payout: {
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		selectOptionPaper: {
			padding: 10
		}
	} )
);

const WayGameSymbolPayoutViewer: FC<SymbolPayoutViewerProps> = ( props: SymbolPayoutViewerProps ) => {
	const { symbolPayoutsMap, ...other } = props;

	const classes = useStyles();

	const elements: Array<ReactElement> = [];

	symbolPayoutsMap.forEach( ( payouts, symbol ) => {
		const payoutElements: Array<ReactElement> = payouts.map( ( payout, index ) =>
			<Box key={index}>
				{payout.num + ', ' + payout.multi}
			</Box>
		);

		elements.push(
			<Grid item key={symbol} xs={6} sm={3} md={2} lg={2} >
				<Paper className={classes.selectOptionPaper}>
					<Typography>
						{symbol}
					</Typography>
					<FormGroup>
						{payoutElements}
					</FormGroup>
				</Paper>
			</Grid>
		);
	} );

	return (
		<Box {...other}>
			<Grid container spacing={2}>
				{elements}
			</Grid >
		</Box>
	);
};

export default WayGameSymbolPayoutViewer;