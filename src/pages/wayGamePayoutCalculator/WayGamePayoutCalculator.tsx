import React, { FC, useState } from 'react';
import { makeStyles, createStyles, Box, Divider } from '@material-ui/core';
import { ISymbolPayoutData, SymbolType } from '../../core/BasicDataInterfaces';
import SlotSetting from '../../components/slotSetting/SlotSetting';
import { default as AvailableSymbolSelector, ISymbolOptionData } from './components/availableSymbolSelector/WayGamePayoutAvailableSymbolSelector';
import { default as Result } from './components/result/WayGamePayoutResult';
import { default as Config, IWayGamePayoutCalculatorConfig } from './WayGamePayoutCalculatorConfig';


const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		divider: {
			marginBlock: '10px',
			height: 0
		},
		slotSetting: {
			marginBlock: '30px',
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
			}}
			className={classes.slotSetting}
		/>
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

