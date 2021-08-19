import React, { FC, useState } from 'react';
import { Box, createStyles, makeStyles, TextField } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { ISymbolPayoutData } from '../../core/BasicDataInterfaces';
import { default as AvailableSymbolSelector, ISymbolOptionData } from './availableSymbolSelector/SymbolPayoutGeneratorAvailableSymbolSelector';
import { default as Result } from './result/symbolPayoutGeneratorResult';
import { default as Config, ISymbolPayoutGeneratorConfig } from './SymbolPayoutGeneratorConfig';

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		symbolSelector: {
			marginBlock: '10px',
		}
	} )
);

const config: ISymbolPayoutGeneratorConfig = Config;

export const SymbolPayoutGenerator: FC = () => {
	const [ reelAmount, setReelAmount ] = useState( config.defaultReelAmount );

	const [ originalOptionList, setOriginalOptionList ] = useState(
		config.defaultOriginalOptionList.map( option => ( {
			...option,
			payoutData: {
				...option.payoutData,
				kindMultiplierMap: new Map<number, number>( option.payoutData.kindMultiplierMap )
			}
		} as ISymbolOptionData ) )
	);

	const [ customOptionList, setCustomOptionList ] = useState( [ config.defaultCustomOptionData ] );

	const [ availableSymbolPayoutMap, setAvailableSymbolPayoutMap ] = useState( getCheckedOptionDatas( config.defaultOriginalOptionList ) );

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ): void => {
		const value: string = event.target.value;
		let newReelAmount: number = Number.parseInt( value );
		const isValidReelAmount = !Number.isNaN( newReelAmount );
		if ( !isValidReelAmount || newReelAmount < 1 ) {
			newReelAmount = 1;
		}
		setReelAmount( newReelAmount );

		const lastReelAmount: number = reelAmount;

		let newOriginalOptionList: Array<ISymbolOptionData> = originalOptionList.slice();
		newOriginalOptionList = newOriginalOptionList.map( option => {
			let lastKindMultiplier: number | undefined = option.payoutData.kindMultiplierMap.get( lastReelAmount );
			lastKindMultiplier = lastKindMultiplier ? lastKindMultiplier : 0;
			for ( let kinds = lastReelAmount + 1; kinds <= newReelAmount; kinds++ ) {
				if ( kinds >= option.payoutData.atleastKind ) {
					option.payoutData.kindMultiplierMap.set( kinds, lastKindMultiplier );
				}
			}
			for ( let kinds = lastReelAmount; kinds > newReelAmount; kinds-- ) {
				option.payoutData.kindMultiplierMap.delete( kinds );
			}
			return option;
		} );
		setOriginalOptionList( newOriginalOptionList );

		let newCustomOptionList: Array<ISymbolOptionData> = customOptionList.slice();
		newCustomOptionList = newCustomOptionList.map( option => {
			let lastKindMultiplier: number | undefined = option.payoutData.kindMultiplierMap.get( lastReelAmount );
			lastKindMultiplier = lastKindMultiplier ? lastKindMultiplier : 0;
			for ( let kinds = lastReelAmount + 1; kinds <= newReelAmount; kinds++ ) {
				if ( kinds >= option.payoutData.atleastKind ) {
					option.payoutData.kindMultiplierMap.set( kinds, lastKindMultiplier );
				}
			}
			for ( let kinds = lastReelAmount; kinds > newReelAmount; kinds-- ) {
				option.payoutData.kindMultiplierMap.delete( kinds );
			}
			return option;
		} );
		setCustomOptionList( newCustomOptionList );

		const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
			...getCheckedOptionDatas( newOriginalOptionList ), ...getCheckedOptionDatas( newCustomOptionList )
		] );
		setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
	};

	const onOriginalOptionDataChange = ( index: number, optionData: ISymbolOptionData ) => {
		const newOriginalOptionList: Array<ISymbolOptionData> = originalOptionList.slice();
		newOriginalOptionList[ index ] = optionData;
		setOriginalOptionList( newOriginalOptionList );

		const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
			...getCheckedOptionDatas( newOriginalOptionList ), ...getCheckedOptionDatas( customOptionList )
		] );
		setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
	};

	const onCustomOptionDataChange = ( index: number, optionData: ISymbolOptionData ) => {
		const newCustomOptionList: Array<ISymbolOptionData> = customOptionList.slice();
		newCustomOptionList[ index ] = optionData;
		setCustomOptionList( newCustomOptionList );

		const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
			...getCheckedOptionDatas( originalOptionList ), ...getCheckedOptionDatas( newCustomOptionList )
		] );
		setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
	};

	const onAddNewCustomOption = () => {
		const newCustomOptionList: Array<ISymbolOptionData> = customOptionList.slice();
		const lastIndex = newCustomOptionList.length - 1;

		newCustomOptionList[ lastIndex ].checked = true;
		newCustomOptionList.push( config.defaultCustomOptionData );
		setCustomOptionList( newCustomOptionList );

		const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
			...getCheckedOptionDatas( originalOptionList ), ...getCheckedOptionDatas( newCustomOptionList )
		] );
		setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
	};

	const classes: ClassNameMap = useStyles();

	return (
		<Box component='form' className={classes.root}>
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
			<AvailableSymbolSelector
				originalOptionList={originalOptionList}
				customOptionList={customOptionList}
				onOriginalOptionDataChange={onOriginalOptionDataChange}
				onCustomOptionDataChange={onCustomOptionDataChange}
				onAddNewCustomOption={onAddNewCustomOption}
				reelCount={reelAmount}
				className={classes.symbolSelector}
			/>
			<Result
				symbolPayoutMap={availableSymbolPayoutMap}
			/>
		</Box>
	);
};

export default SymbolPayoutGenerator;

function getCheckedOptionDatas ( options: Array<ISymbolOptionData> ): Map<string, ISymbolPayoutData> {
	const checkedOptions: Array<ISymbolOptionData> = options.filter( option => option.checked === true );
	const result: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>(
		checkedOptions.map( option => [ option.symbol, option.payoutData ] )
	);
	return result;
}