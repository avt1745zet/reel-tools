import React, { FC, useState, useCallback } from 'react';
import { Box, createStyles, Fab, makeStyles, TextField, Tooltip } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { IPayout } from '../../core/SlotGameDataInterfaces';
import { ISymbolPayoutData, SymbolType } from '../../core/BasicDataInterfaces';
import { default as AvailableSymbolSelector, ISymbolOptionData } from './availableSymbolSelector/SymbolPayoutGeneratorAvailableSymbolSelector';
import { default as SymbolPayoutTextEditor } from './symbolPayoutTextEditor/SymbolPayoutGeneratorSymbolPayoutTextEditor';
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

	const [ optionList, setOptionList ] = useState(
		config.defaultOptionList.map( option => ( {
			...option,
			payoutData: {
				...option.payoutData,
				kindMultiplierMap: new Map<number, number>( option.payoutData.kindMultiplierMap )
			}
		} as ISymbolOptionData ) )
	);

	const [ availableSymbolPayoutMap, setAvailableSymbolPayoutMap ] = useState( getCheckedOptionsData( config.defaultOptionList ) );

	const [ symbolPayoutText, setSymbolPayoutText ] = useState( '' );

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ): void => {
		const value: string = event.target.value;
		let newReelAmount: number = Number.parseInt( value );
		const isValidReelAmount = !Number.isNaN( newReelAmount );
		if ( !isValidReelAmount || newReelAmount < 1 ) {
			newReelAmount = 1;
		}
		setReelAmount( newReelAmount );

		const lastReelAmount: number = reelAmount;

		let newOptionList: Array<ISymbolOptionData> = optionList.slice();
		newOptionList = newOptionList.map( option => {
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
		setOptionList( newOptionList );
	};

	const handleOptionDataChange = ( index: number, data: ISymbolOptionData ) => {
		setOptionList( optionData => {
			const newOptionList: Array<ISymbolOptionData> = optionData.slice();
			newOptionList[ index ] = data;
			return newOptionList;
		} );
	};

	const memoHandleOptionDataChange = useCallback( handleOptionDataChange, [] );

	const handleAddNewOptionButtonClick = () => {
		const newOptionList: Array<ISymbolOptionData> = optionList.slice();
		const lastIndex = newOptionList.length - 1;

		newOptionList[ lastIndex ].checked = true;
		newOptionList.push( config.defaultOptionData );
		setOptionList( newOptionList );
	};

	const handleSymbolPayoutTextChange = useCallback( ( text: string ) => {
		setSymbolPayoutText( text );
	}, [] )

	const handleConvertToTextButtonClick = () => {
		const newAvailableSymbolPayoutMap: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>( [
			...getCheckedOptionsData( optionList )
		] );
		setAvailableSymbolPayoutMap( newAvailableSymbolPayoutMap );
	};

	const handleConvertToSettingButtonClick = () => {
		try {
			const map: Map<string, Array<IPayout>> = convertTextToSymbolPayoutMap( symbolPayoutText );
			const newOptionList: Array<ISymbolOptionData> = [];
			map.forEach( ( payouts, symbol ) => {
				const atleastKind: number = payouts.length > 0 ? payouts.sort( ( a, b ) => a.num - b.num )[ 0 ].num : reelAmount + 1;
				newOptionList.push( {
					symbol: symbol,
					payoutData: {
						atleastKind: atleastKind,
						kindMultiplierMap: new Map<number, number>( payouts.map( ( v ) => [ v.num, v.multi ] ) ),
						symbolType: SymbolType.NORMAL
					},
					checked: true
				} );
			} );
			setOptionList( newOptionList );
		} catch {
			alert( 'Symbol payout text format is worng, Please double check it :)' );
		}
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
				optionList={optionList}
				onOptionDataChange={memoHandleOptionDataChange}
				onAddNewOption={handleAddNewOptionButtonClick}
				reelCount={reelAmount}
				className={classes.symbolSelector}
			/>
			<Box textAlign='center' marginY={2}>
				<Box display='inline-block' marginX={2}>
					<Tooltip title='Convert to text'>
						<Fab color='primary' onClick={handleConvertToTextButtonClick} >
							<ArrowDownwardIcon />
						</Fab>
					</Tooltip>
				</Box>
				<Box display='inline-block' marginX={2}>
					<Tooltip title='Convert to setting'>
						<Fab
							color='secondary' onClick={handleConvertToSettingButtonClick}>
							<ArrowUpwardIcon />
						</Fab>
					</Tooltip>
				</Box>
			</Box>
			<SymbolPayoutTextEditor
				symbolPayoutMap={availableSymbolPayoutMap}
				onTextChange={handleSymbolPayoutTextChange}
			/>
		</Box>
	);
};

export default SymbolPayoutGenerator;

function getCheckedOptionsData ( options: Array<ISymbolOptionData> ): Map<string, ISymbolPayoutData> {
	const checkedOptions: Array<ISymbolOptionData> = options.filter( option => option.checked === true );
	const result: Map<string, ISymbolPayoutData> = new Map<string, ISymbolPayoutData>(
		checkedOptions.map( option => [ option.symbol, option.payoutData ] )
	);
	return result;
}

const convertTextToSymbolPayoutMap = ( input: string ): Map<string, Array<IPayout>> => {
	let iteratorText: string = input;
	iteratorText = iteratorText.replaceAll( "'", '"' );

	let searchIndex = 0;
	while ( true ) {
		const colonIndex: number = iteratorText.indexOf( ':', searchIndex );
		const lastSpaceIndex: number = iteratorText.lastIndexOf( ' ', colonIndex );
		if ( colonIndex !== -1 ) {
			iteratorText = iteratorText.substring( 0, lastSpaceIndex + 1 ) + '"' + iteratorText.substring( lastSpaceIndex + 1 );
			iteratorText = iteratorText.substring( 0, colonIndex + 1 ) + '"' + iteratorText.substring( colonIndex + 1 );
			searchIndex = colonIndex + 3;
		} else {
			break;
		}
	}

	const iterator: Iterable<[ string, Array<IPayout> ]> = JSON.parse( iteratorText );

	const result: Map<string, Array<IPayout>> = new Map<string, Array<IPayout>>( iterator )

	return result;
};