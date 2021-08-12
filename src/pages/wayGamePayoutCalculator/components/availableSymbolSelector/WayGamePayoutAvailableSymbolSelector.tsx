import React, { ChangeEvent, FC, ReactElement } from 'react';
import { Box, Checkbox, createStyles, Fab, FormControl, FormControlLabel, FormControlProps, FormGroup, Grid, makeStyles, Paper, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { ISymbolPayoutData, SymbolType } from '../../../../core/BasicDataInterfaces';

export interface AvailableSymbolSelectorPanelProps {
	originalOptionList: Array<ISymbolOptionData>;
	customOptionList: Array<ISymbolOptionData>;
	onOriginalOptionDataChange ( index: number, optionData: ISymbolOptionData ): void;
	onCustomOptionDataChange ( index: number, optionData: ISymbolOptionData ): void;
	onAddNewCustomOption (): void;
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
	} ),
);

const WayGamePayoutAvailableSymbolSelector: FC<AvailableSymbolSelectorPanelProps> = ( props: AvailableSymbolSelectorPanelProps ) => {
	const { originalOptionList, customOptionList, onOriginalOptionDataChange, onCustomOptionDataChange, onAddNewCustomOption, reelCount } = props;

	const classes = useStyles();

	const originalOptions: Array<ReactElement> = originalOptionList.map( ( optionData, optionIndex ) => {
		const handleCheckboxChange = ( index: number ) => ( event: ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			onOriginalOptionDataChange( index, {
				...optionData,
				checked: checked
			} );
		};

		const handleAtleastKindChange = ( index: number ) => ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
			const newAtleastKind = Number.parseInt( event.target.value );
			const isVaild = newAtleastKind >= 1 && newAtleastKind <= reelCount;
			if ( isVaild ) {
				onOriginalOptionDataChange( index, {
					...optionData,
					payoutData: {
						...optionData.payoutData,
						atleastKind: newAtleastKind
					}
				} );
			}
		};

		const handleMultiplierChange = ( index: number, kinds: number ) => ( newMultiplier: number ) => {
			const newKindMultiplierMap: Map<number, number> = new Map<number, number>( [ ...optionData.payoutData.kindMultiplierMap ] );
			newKindMultiplierMap.set( kinds, newMultiplier );

			onOriginalOptionDataChange( index, {
				...optionData,
				payoutData: {
					...optionData.payoutData,
					kindMultiplierMap: newKindMultiplierMap
				}
			} );
		};

		const payoutElements: Array<ReactElement> = [];
		const payoutData: ISymbolPayoutData = optionData.payoutData;

		for ( let kinds = payoutData.atleastKind; kinds <= reelCount; kinds++ ) {
			let multiplier: number | undefined = payoutData.kindMultiplierMap.get( kinds );
			multiplier = multiplier ? multiplier : 0;
			payoutElements.push(
				<PayoutSetting
					key={kinds}
					kinds={kinds}
					multiplier={multiplier}
					onMultiplierChange={handleMultiplierChange( optionIndex, kinds )}
					className={classes.payout}
				/>
			);
		}

		return (
			<Grid item key={optionIndex} xs={12} sm={6} md={4} lg={3} xl={2}>
				<Paper className={classes.selectOptionPaper}>
					<Box display='flex' justifyContent='space-between'>
						<FormControlLabel
							control={
								<Checkbox
									color='primary'
									checked={optionData.checked}
									onChange={handleCheckboxChange( optionIndex )}
								/>
							}
							label={optionData.symbol}
						/>
						<TextField
							label='At least kind'
							type='number'
							value={optionData.payoutData.atleastKind}
							onChange={handleAtleastKindChange( optionIndex )}
						/>
					</Box>
					<FormGroup>
						{payoutElements}
					</FormGroup>
				</Paper>
			</Grid>
		)
	} );

	const customOptions: Array<ReactElement> = customOptionList.map( ( optionData, optionIndex ) => {
		const handleCheckboxChange = ( index: number ) => ( event: ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			onCustomOptionDataChange( index, {
				...optionData,
				checked: checked
			} );
		};

		const handleSymbolNameChange = ( index: number ) => ( event: ChangeEvent<HTMLInputElement> ) => {
			const symbol: string = event.target.value.toUpperCase();
			onCustomOptionDataChange( index, {
				...optionData,
				symbol: symbol
			} );
		};

		const handleAtleastKindChange = ( index: number ) => ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
			const newAtleastKind = Number.parseInt( event.target.value );
			const isVaild = newAtleastKind >= 1 && newAtleastKind <= reelCount;
			if ( isVaild ) {
				onCustomOptionDataChange( index, {
					...optionData,
					payoutData: {
						...optionData.payoutData,
						atleastKind: newAtleastKind
					}
				} );
			}
		};

		const handleMultiplierChange = ( index: number, kinds: number ) => ( newMultiplier: number ) => {
			const newKindMultiplierMap: Map<number, number> = new Map<number, number>( [ ...optionData.payoutData.kindMultiplierMap ] );
			newKindMultiplierMap.set( kinds, newMultiplier );

			onCustomOptionDataChange( index, {
				...optionData,
				payoutData: {
					...optionData.payoutData,
					kindMultiplierMap: newKindMultiplierMap
				}
			} );
		};

		const handleSymbolTypeChange = ( index: number, symbolType: SymbolType ) => ( event: ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			const newSmbolType: SymbolType = checked ? symbolType : SymbolType.NORMAL;

			onCustomOptionDataChange( index, {
				...optionData,
				payoutData: {
					...optionData.payoutData,
					symbolType: newSmbolType
				}
			} );
		};

		const payoutElements: Array<ReactElement> = [];
		const payoutData: ISymbolPayoutData = optionData.payoutData;

		for ( let kinds = payoutData.atleastKind; kinds <= reelCount; kinds++ ) {
			let multiplier: number | undefined = payoutData.kindMultiplierMap.get( kinds );
			multiplier = multiplier ? multiplier : 0;
			payoutElements.push(
				<PayoutSetting
					key={kinds}
					kinds={kinds}
					multiplier={multiplier}
					onMultiplierChange={handleMultiplierChange( optionIndex, kinds )}
					className={classes.payout}
				/>
			);
		}

		return (
			<Grid item key={'custom' + optionIndex} xs={12} sm={6} md={4} lg={3} xl={2}>
				<Paper className={classes.selectOptionPaper}>
					<Box display='flex' justifyContent='space-between'>
						<FormControlLabel
							control={<Checkbox
								key='checkbox'
								color='primary'
								checked={optionData.checked}
								onChange={handleCheckboxChange( optionIndex )}
								disabled={optionData.symbol === ''}
							/>}
							label={<TextField
								key='textField'
								label='Custom'
								placeholder='Define symbol...'
								value={optionData.symbol}
								onChange={handleSymbolNameChange( optionIndex )}
							/>}
						/>
						<TextField
							fullWidth
							label='At least kind'
							type='number'
							value={optionData.payoutData.atleastKind}
							onChange={handleAtleastKindChange( optionIndex )}
						/>
					</Box>
					<FormGroup>
						{payoutElements}
					</FormGroup>
					<FormGroup row>
						<FormControlLabel
							control={
								<Checkbox
									color='primary'
									checked={optionData.payoutData.symbolType === SymbolType.WILD}
									onChange={handleSymbolTypeChange( optionIndex, SymbolType.WILD )}
								/>
							}
							label='Is Wild?'
						/>
						<FormControlLabel
							control={
								<Checkbox
									color='primary'
									checked={optionData.payoutData.symbolType === SymbolType.SCATTER}
									onChange={handleSymbolTypeChange( optionIndex, SymbolType.SCATTER )}
								/>
							}
							label='Is Scatter?'
						/>
					</FormGroup>
				</Paper>
			</Grid>
		)
	} );

	const handleAddCustomButtonClick = () => {
		onAddNewCustomOption();
	};

	const addCustomButtonEnabled: boolean = customOptionList[ customOptionList.length - 1 ].symbol.length > 0;

	return <Grid container spacing={2}>
		{originalOptions}
		{customOptions}
		<Grid item container xs={12} sm={6} md={4} lg={3} xl={2} alignItems='center' justifyContent='center'>
			<Tooltip title={addCustomButtonEnabled ? 'Add custom symbol' : 'Add custom symbol.(need to fill custom symbol name first)'}>
				{/*
				//? Material-UI: You are providing a disabled `button` child to the Tooltip component. A disabled element does not fire events.
				//? Tooltip needs to listen to the child element's events to display the title.
				//? Add a simple wrapper element, such as a `span`. 
				*/}
				<Box component='span'>
					<Fab
						color='primary'
						disabled={!addCustomButtonEnabled}
						onClick={handleAddCustomButtonClick}
					>
						<AddIcon />
					</Fab>
				</Box>
			</Tooltip>
		</Grid>
	</Grid >;
}

export default WayGamePayoutAvailableSymbolSelector;

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
}