import React, { FC, useState } from 'react';
import { Box, createStyles, makeStyles, TextField } from '@material-ui/core';
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

	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( config.defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( [ config.defaultCustomOptionData ] );

	const [ availableSymbolPayoutMap, setAvailableSymbolPayoutMap ] = useState( getCheckedOptionDatas( config.defaultSelectOptionList ) );

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ): void => {
		const value: string = event.target.value;
		let newReelAmount: number = Number.parseInt( value );
		const isValidMultiplier = !Number.isNaN( newReelAmount );
		if ( !isValidMultiplier || newReelAmount < 1 ) {
			newReelAmount = 1;
		}
		setReelAmount( newReelAmount );
	}

	const classes = useStyles();

	return <Box component='form' className={classes.root}>
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
			originalOptionList={originalSelectOptionList}
			customOptionList={customSelectOptionList}
			onOriginalOptionDataChange={( index: number, statu: ISymbolOptionData ) => {
				const newOriginalSelectOptionList: Array<ISymbolOptionData> = originalSelectOptionList.slice();
				newOriginalSelectOptionList[ index ] = statu;
				setOriginalSelectOptionList( newOriginalSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedOptionDatas( newOriginalSelectOptionList ), ...getCheckedOptionDatas( customSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
			}}
			onCustomOptionDataChange={( index: number, statu: ISymbolOptionData ) => {
				const newCustomSelectOptionList: Array<ISymbolOptionData> = customSelectOptionList.slice();
				newCustomSelectOptionList[ index ] = statu;
				setCustomSelectOptionList( newCustomSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedOptionDatas( originalSelectOptionList ), ...getCheckedOptionDatas( newCustomSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
			}}
			onAddNewCustomOption={() => {
				const newCustomSelectOptionList: Array<ISymbolOptionData> = customSelectOptionList.slice();
				const lastIndex = newCustomSelectOptionList.length - 1;

				newCustomSelectOptionList[ lastIndex ].checked = true;
				newCustomSelectOptionList.push( config.defaultCustomOptionData );
				setCustomSelectOptionList( newCustomSelectOptionList );

				const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
					...getCheckedOptionDatas( originalSelectOptionList ), ...getCheckedOptionDatas( newCustomSelectOptionList )
				] );
				setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
			}}
			reelCount={reelAmount}
			className={classes.symbolSelector}
		/>
		<Result
			symbolPayoutMap={availableSymbolPayoutMap}
		/>
	</Box>
};

export default SymbolPayoutGenerator;

function getCheckedOptionDatas ( options: Array<ISymbolOptionData> ): Map<string, ISymbolPayoutData> {
	const checkedOptions: Array<ISymbolOptionData> = options.filter( option => option.checked === true );
	const result: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>(
		checkedOptions.map( option => [ option.symbol, option.payoutData ] )
	);
	return result;
}