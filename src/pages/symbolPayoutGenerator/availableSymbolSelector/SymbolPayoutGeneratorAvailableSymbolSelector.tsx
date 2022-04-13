import React, { ChangeEvent, FC, ReactElement, useCallback, memo } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { CommonProps, OverridableTypeMap } from '@material-ui/core/OverridableComponent';
import { Box, Checkbox, createStyles, Fab, FormControl, FormControlLabel, FormControlProps, FormGroup, Grid, makeStyles, Paper, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { ISymbolPayoutData } from '../../../core/BasicDataInterfaces';

export interface SymbolPayoutGeneratorAvailableSymbolSelectorProps extends CommonProps<OverridableTypeMap> {
	optionList: Array<ISymbolOptionData>;
	onOptionDataChange ( index: number, data: ISymbolOptionData ): void;
	onAddNewOption (): void;
	reelCount: number;
}

export interface ISymbolOptionData {
	symbol: string;
	checked: boolean;
	payoutData: ISymbolPayoutData;
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

const SymbolPayoutGeneratorAvailableSymbolSelector: FC<SymbolPayoutGeneratorAvailableSymbolSelectorProps> = ( props: SymbolPayoutGeneratorAvailableSymbolSelectorProps ) => {
	const { optionList, onOptionDataChange, onAddNewOption, reelCount, ...other } = props;

	const handleOptionDataChange = ( index: number, data: ISymbolOptionData ) => {
		onOptionDataChange( index, data );
	}

	const memoHandleOptionDataChange = useCallback( handleOptionDataChange, [ onOptionDataChange ] );

	const options: Array<ReactElement> = optionList.map( ( data, index ) =>
		<MemoSymbolSelectorPanel
			index={index}
			key={index}
			data={data}
			reelCount={reelCount}
			onDataChange={memoHandleOptionDataChange}
		/>
	);

	const handleAddOptionButtonClick = () => {
		onAddNewOption();
	};

	const addOptionButtonEnabled: boolean = optionList[ optionList.length - 1 ].symbol.length > 0;

	return (
		<Grid container spacing={2} {...other}>
			{options}
			<Grid item container xs={12} sm={6} md={4} lg={3} xl={2} alignItems='center' justifyContent='center'>
				<Tooltip title={addOptionButtonEnabled ? 'Add custom symbol' : 'Add custom symbol.(need to fill custom symbol name first)'}>
					{/*
						//? Material-UI: You are providing a disabled `button` child to the Tooltip component. A disabled element does not fire events.
						//? Tooltip needs to listen to the child element's events to display the title.
						//? Add a simple wrapper element, such as a `span`. 
					*/}
					<Box component='span'>
						<Fab
							color='primary'
							disabled={!addOptionButtonEnabled}
							onClick={handleAddOptionButtonClick}
						>
							<AddIcon />
						</Fab>
					</Box>
				</Tooltip>
			</Grid>
		</Grid>
	);
}

export default SymbolPayoutGeneratorAvailableSymbolSelector;

interface SymbolSelectorPanelProps {
	index: number;
	data: ISymbolOptionData;
	reelCount: number;
	onDataChange?( index: number, data: ISymbolOptionData ): void;
}

const SymbolSelectorPanel: FC<SymbolSelectorPanelProps> = ( props: SymbolSelectorPanelProps ) => {
	const { index, data, reelCount, onDataChange } = props;

	const classes: ClassNameMap = useStyles();

	const handleCheckboxChange = ( event: ChangeEvent<HTMLInputElement>, checked: boolean ) => {
		if ( onDataChange ) {
			onDataChange( index, {
				...data,
				checked: checked
			} );
		}
	};

	const handleSymbolNameChange = ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const newName: string = event.target.value.toUpperCase();
		if ( onDataChange ) {
			onDataChange( index, {
				...data,
				symbol: newName
			} );
		}
	};

	const handleAtleastKindChange = ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const value: string = event.target.value;

		let atleastKind: number = Number.parseInt( value );

		const isValidNumber = !Number.isNaN( atleastKind );
		if ( !isValidNumber ) {
			atleastKind = 0;
		}

		if ( atleastKind < 1 ) {
			atleastKind = 1;
		}
		if ( atleastKind > reelCount ) {
			atleastKind = reelCount;
		}

		const lastAtleastKind: number = data.payoutData.atleastKind;
		const newKindMultiplierMap: Map<number, number> = new Map<number, number>( data.payoutData.kindMultiplierMap );

		let lastKindMultiplier: number | undefined = data.payoutData.kindMultiplierMap.get( lastAtleastKind );
		lastKindMultiplier = lastKindMultiplier ? lastKindMultiplier : 0;

		for ( let kinds = lastAtleastKind; kinds < atleastKind; kinds++ ) {
			newKindMultiplierMap.delete( kinds );
		}
		for ( let kinds = ( lastAtleastKind - 1 ); kinds >= atleastKind; kinds-- ) {
			if ( kinds <= reelCount ) {
				newKindMultiplierMap.set( kinds, lastKindMultiplier );
			}
		}

		if ( onDataChange ) {
			onDataChange( index, {
				...data,
				payoutData: {
					...data.payoutData,
					atleastKind: atleastKind,
					kindMultiplierMap: newKindMultiplierMap
				}
			} );
		}
	};

	const handleMultiplierChange = ( kinds: number ) => ( newMultiplier: number ) => {
		const newKindMultiplierMap: Map<number, number> = new Map<number, number>( [ ...data.payoutData.kindMultiplierMap ] );
		newKindMultiplierMap.set( kinds, newMultiplier );

		if ( onDataChange ) {
			onDataChange( index, {
				...data,
				payoutData: {
					...data.payoutData,
					kindMultiplierMap: newKindMultiplierMap
				}
			} );
		}
	};

	const payoutElements: Array<ReactElement> = [];

	for ( let kinds = data.payoutData.atleastKind; kinds <= reelCount; kinds++ ) {
		let multiplier: number | undefined = data.payoutData.kindMultiplierMap.get( kinds );
		multiplier = multiplier ? multiplier : 0;
		payoutElements.push(
			<PayoutSetting
				key={kinds}
				kinds={kinds}
				multiplier={multiplier}
				onMultiplierChange={handleMultiplierChange( kinds )}
				className={classes.payout}
			/>
		);
	}

	return (
		<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
			<Paper className={classes.selectOptionPaper}>
				<Box display='flex' justifyContent='space-between'>
					<FormControlLabel
						control={
							<Checkbox
								key='checkbox'
								color='primary'
								checked={data.checked}
								onChange={handleCheckboxChange}
								disabled={data.symbol.length === 0}
							/>
						}
						label={
							<TextField
								key='textField'
								label='Name'
								placeholder='Define symbol...'
								value={data.symbol}
								onChange={handleSymbolNameChange}
							/>
						}
					/>
					<TextField
						fullWidth
						label='At least kind'
						type='number'
						inputProps={{
							min: 1,
							max: reelCount
						}}
						value={data.payoutData.atleastKind}
						onChange={handleAtleastKindChange}
					/>
				</Box>
				<FormGroup>
					{payoutElements}
				</FormGroup>
			</Paper>
		</Grid>
	);
};

const MemoSymbolSelectorPanel = memo( SymbolSelectorPanel );

interface PayoutSettingProps extends FormControlProps {
	kinds: number;
	multiplier: number;
	onMultiplierChange?( newMultiplier: number ): void;
}

const PayoutSetting: FC<PayoutSettingProps> = ( props: PayoutSettingProps ) => {
	const { kinds, multiplier, onMultiplierChange, ...other } = props;

	const handleMultiplierChange = ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		if ( onMultiplierChange ) {
			const value: string = event.target.value;
			let multiplier: number = Number.parseFloat( value );
			const isValidMultiplier = !Number.isNaN( multiplier );
			if ( !isValidMultiplier ) {
				multiplier = 0;
			}
			onMultiplierChange( multiplier );
		}
	}

	return (
		<FormControl {...other}>
			<TextField
				label='Kind'
				inputProps={{ readOnly: true }}
				value={'×' + kinds}
			/>
			<TextField
				InputLabelProps={{
					shrink: true
				}}
				inputProps={{
					min: 0,
					step: 0.1
				}}
				type='number'
				label='Multiplier'
				value={multiplier}
				onChange={handleMultiplierChange}
			/>
		</FormControl >
	)
};