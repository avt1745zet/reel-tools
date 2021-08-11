import React, { FC, ReactElement, useState } from 'react';
import { makeStyles, createStyles, Box, Typography, Grid, TextField, Divider, FormControl, MenuItem, Select } from '@material-ui/core';
import { ISymbolPayoutData, IVector2, SymbolType } from '../../core/BasicDataInterfaces';
import { default as AvailableSymbolSelector, ISymbolOptionData } from './components/availableSymbolSelector/WayGamePayoutAvailableSymbolSelector';
import { default as Result } from './components/result/WayGamePayoutResult';
import { default as Config, IWayGamePayoutCalculatorConfig } from './WayGamePayoutCalculatorConfig';

interface SlotSettingProps {
	title?: string;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange ( newReelIndexes: Array<Array<string>> ): void;
}

interface SelectTableProps {
	reelAmount: number;
	symbolAmount: number;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange ( posiiton: IVector2, value: string ): void;
}

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		divider: {
			marginBlock: '10px',
			height: 0
		}
	} )
);

const config: IWayGamePayoutCalculatorConfig = Config;

const WayGamePayoutCalculator: FC = () => {
	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( config.defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( config.defaultCustomOptionList );

	const [ availableSymbolPayoutMap, setAvailableSymbolPayoutMap ] = useState( getCheckedSymbolInfos( config.defaultSelectOptionList ) );

	const defaultReelIndexes: Array<Array<string>> = new Array<Array<string>>( config.defaultReelAmount );
	const availableSymbolList: Array<string> = Array.from( availableSymbolPayoutMap.keys() );
	for ( let reelIndex = 0; reelIndex < config.defaultReelAmount; reelIndex++ ) {
		defaultReelIndexes[ reelIndex ] = new Array<string>( config.defaultSymbolAmount );
		for ( let symbolIndex = 0; symbolIndex < config.defaultSymbolAmount; symbolIndex++ ) {
			const symbolName: string = availableSymbolList[ config.defaultSelectIndex ];
			defaultReelIndexes[ reelIndex ][ symbolIndex ] = symbolName;
		}
	}

	const [ reelIndexes, setReelIndexes ] = useState( defaultReelIndexes );
	const [ bet, setBet ] = useState( config.defaultBet );

	const setReelIndexesByAvailableSymbolList = ( reelIndexes: Array<Array<string>>, selectSymbolList: Array<string> ): void => {
		const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
		newReelIndexes.forEach( ( reel, reelIndex ) => {
			reel.forEach( ( symbol, symbolIndex ) => {
				const isSymbolOutOfRange = !selectSymbolList.includes( symbol );
				if ( isSymbolOutOfRange ) {
					newReelIndexes[ reelIndex ][ symbolIndex ] = selectSymbolList[ 0 ];
				}
			} )
		} );
		setReelIndexes( newReelIndexes );
	}

	const classes = useStyles();

	return <Box component='form' className={classes.root}>
		<AvailableSymbolSelector
			originalOptionList={originalSelectOptionList}
			customOptionList={customSelectOptionList}
			onOriginalOptionDataChange={( index: number, statu: ISymbolOptionData ) => {
				const newOriginalSelectOptionList: Array<ISymbolOptionData> = originalSelectOptionList.slice();
				newOriginalSelectOptionList[ index ] = statu;
				setOriginalSelectOptionList( newOriginalSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedSymbolInfos( newOriginalSelectOptionList ), ...getCheckedSymbolInfos( customSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );

				setReelIndexesByAvailableSymbolList( reelIndexes, Array.from( newAvailableSymbolPayoutMap.keys() ) );
			}}
			onCustomOptionDataChange={( index: number, statu: ISymbolOptionData ) => {
				const newCustomSelectOptionList: Array<ISymbolOptionData> = customSelectOptionList.slice();
				newCustomSelectOptionList[ index ] = statu;
				setCustomSelectOptionList( newCustomSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedSymbolInfos( originalSelectOptionList ), ...getCheckedSymbolInfos( newCustomSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );

				setReelIndexesByAvailableSymbolList( reelIndexes, Array.from( newAvailableSymbolPayoutMap.keys() ) );
			}}
			onAddNewCustomOption={() => {
				const newCustomSelectOptionList: Array<ISymbolOptionData> = customSelectOptionList.slice();
				const lastIndex = newCustomSelectOptionList.length - 1;

				newCustomSelectOptionList[ lastIndex ].checked = true;
				newCustomSelectOptionList.push( {
					symbol: '',
					checked: false,
					payoutData: {
						atleastKind: 3,
						kindMultiplierMap: new Map( [] ),
						symbolType: SymbolType.NORMAL
					}
				} );
				setCustomSelectOptionList( newCustomSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedSymbolInfos( originalSelectOptionList ), ...getCheckedSymbolInfos( newCustomSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );

				setReelIndexesByAvailableSymbolList( reelIndexes, Array.from( newAvailableSymbolPayoutMap.keys() ) );
			}}
			reelCount={reelIndexes.length}
		/>
		<Divider className={classes.divider} />
		<SlotSetting
			availableSymbolList={availableSymbolList}
			reelIndexes={reelIndexes}
			onChange={newReelIndexes => {
				setReelIndexes( newReelIndexes );
			}} />
		<Divider className={classes.divider} />
		<Result
			reelIndexes={reelIndexes}
			symbolPayoutMap={availableSymbolPayoutMap}
			bet={bet}
			onBetChange={( newBet ) => {
				setBet( newBet );
			}}
		/>
	</Box>
}

export default WayGamePayoutCalculator;

function getCheckedSymbolInfos ( options: Array<ISymbolOptionData> ): Map<string, ISymbolPayoutData> {
	const checkedOptions: Array<ISymbolOptionData> = options.filter( option => option.checked === true );
	const result: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>(
		checkedOptions.map( option => [ option.symbol, option.payoutData ] )
	);
	return result;
}

const SlotSetting: FC<SlotSettingProps> = ( props: SlotSettingProps ) => {
	const { title, availableSymbolList, reelIndexes, onChange } = props;

	const reelAmount = reelIndexes.length;
	const symbolAmount = reelIndexes[ 0 ].length;

	const classes = useStyles();

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const newReelAmount = Number.parseInt( event.target.value );

		const newReelIndexes: Array<Array<string>> = new Array<Array<string>>( newReelAmount );
		for ( let i = 0; i < newReelIndexes.length; i++ ) {
			newReelIndexes[ i ] = reelIndexes[ i ] ? reelIndexes[ i ] : newReelIndexes[ 0 ].map( () => availableSymbolList[ 0 ] );
		}
		onChange( newReelIndexes );
	}

	const handleRowAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const newSymbolAmount = Number.parseInt( event.target.value );

		const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
		newReelIndexes.forEach( ( reel, index ) => {
			const newReel: Array<string> = new Array<string>( newSymbolAmount );
			for ( let i = 0; i < newReel.length; i++ ) {
				newReel[ i ] = reel[ i ] ? reel[ i ] : availableSymbolList[ 0 ];
			}
			newReelIndexes[ index ] = newReel;
		} );
		onChange( newReelIndexes );
	}

	const titleElement: ReactElement =
		<Box>
			<Typography color='textPrimary' variant='h5'>
				{title}
			</Typography>
		</Box>;

	const getTitleElement = ( value: string | undefined ) => {
		return value ? titleElement : undefined;
	}

	return (
		<Box>
			{getTitleElement( title )}
			<Grid container item spacing={2} xs={12}>
				<Grid item xs={12} md={6}>
					<TextField
						type='number'
						label='Reel amount'
						fullWidth
						inputProps={{
							min: 1
						}}
						value={reelAmount}
						onChange={handleReelAmountChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						type='number'
						label='Row amount'
						fullWidth
						inputProps={{
							min: 1
						}}
						value={symbolAmount}
						onChange={handleRowAmountChange}
					/>
				</Grid>
			</Grid>
			<SelectsTable reelIndexes={reelIndexes} reelAmount={reelAmount} symbolAmount={symbolAmount} availableSymbolList={availableSymbolList} onChange={( position, value ) => {
				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				newReelIndexes[ position.x ][ position.y ] = value;
				onChange( newReelIndexes );
			}} />
			<Divider className={classes.divider} />
		</Box>
	);
}

const SelectsTable: FC<SelectTableProps> = ( props: SelectTableProps ) => {
	const { reelAmount, symbolAmount, availableSymbolList, reelIndexes, onChange } = props;

	const tableElements: Array<ReactElement> = [];
	for ( let symbolIndex = 0; symbolIndex < symbolAmount; symbolIndex++ ) {
		const rowElements: Array<ReactElement> = [];
		for ( let reelIndex = 0; reelIndex < reelAmount; reelIndex++ ) {
			const options: Array<ReactElement> = [];
			availableSymbolList.forEach( ( symbol, index ) => {
				options.push(
					<MenuItem key={index} value={symbol}>{symbol}</MenuItem>
				);
			} );
			const handleSelectChange = ( position: IVector2 ) => ( event: React.ChangeEvent<{
				name?: string | undefined;
				value: unknown;
			}> ) => {
				const symbol: string = event.target.value as string;
				onChange( position, symbol );
			};
			rowElements.push(
				<Grid item xs key={reelIndex}>
					<FormControl style={{ width: '100%' }}>
						<Select
							value={reelIndexes[ reelIndex ][ symbolIndex ]}
							onChange={handleSelectChange( { x: reelIndex, y: symbolIndex } )}
						>
							{options}
						</Select>
					</FormControl>
				</Grid>
			);
		}
		const row: ReactElement =
			<Grid container item xs={12} key={symbolIndex}>
				{rowElements}
			</Grid>;
		tableElements.push( row );
	}
	return (
		<Grid container item spacing={2} xs={12}>
			{tableElements}
		</Grid>
	);
}