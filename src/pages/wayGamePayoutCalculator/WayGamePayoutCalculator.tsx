import React, { FC, Fragment, useState } from 'react';
import { makeStyles, createStyles, Box, TextField, Typography } from '@material-ui/core';
import SlotSetting from '../../components/slotSetting/SlotSetting';
import { default as SymbolPayoutViewer } from './components/symbolPayoutViewer/WayGameSymbolPayoutViewer';
import { default as Result } from './components/result/WayGamePayoutResult';
import { default as Config, IWayGamePayoutCalculatorConfig } from './WayGamePayoutCalculatorConfig';
import { IPayout } from '../../core/NGFDataInterfaces';

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		symbolPayoutViewer: {
			marginTop: '30px'
		},
		slotSetting: {
			marginBlock: '30px'
		}
	} )
);

const config: IWayGamePayoutCalculatorConfig = Config;

const WayGamePayoutCalculator: FC = () => {
	const defaultSymbolPayoutsMap: Map<string, Array<IPayout>> = new Map<string, Array<IPayout>>();
	const [ symbolPayoutsMap, setSymbolPayoutsMap ] = useState( defaultSymbolPayoutsMap );

	const [ isLegalFormat, setIsLegalFormat ] = useState( defaultSymbolPayoutsMap.size > 0 );

	const defaultAvailableSymbolList: Array<string> = Array.from( defaultSymbolPayoutsMap.keys() );
	const [ availableSymbolList, setAvailableSymbolList ] = useState( defaultAvailableSymbolList );

	const defaultReelIndexes: Array<Array<string>> = new Array<Array<string>>( config.defaultReelAmount );
	for ( let reelIndex = 0; reelIndex < config.defaultReelAmount; reelIndex++ ) {
		defaultReelIndexes[ reelIndex ] = new Array<string>( config.defaultSymbolAmount );
		for ( let symbolIndex = 0; symbolIndex < config.defaultSymbolAmount; symbolIndex++ ) {
			const symbolName: string = defaultAvailableSymbolList[ config.defaultSelectIndex ];
			defaultReelIndexes[ reelIndex ][ symbolIndex ] = symbolName;
		}
	}

	const [ reelIndexes, setReelIndexes ] = useState( defaultReelIndexes );
	const [ bet, setBet ] = useState( config.defaultBet );

	const setReelIndexesByAvailableSymbolList = ( reelIndexes: Array<Array<string>>, availableSymbolList: Array<string> ): void => {
		const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
		newReelIndexes.forEach( ( reel, reelIndex ) => {
			reel.forEach( ( symbol, symbolIndex ) => {
				const isSymbolOutOfRange = !availableSymbolList.includes( symbol );
				if ( isSymbolOutOfRange ) {
					newReelIndexes[ reelIndex ][ symbolIndex ] = availableSymbolList[ 0 ];
				}
			} )
		} );
		setReelIndexes( newReelIndexes );
	}

	const handleInputChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const inputText: string = event.target.value;
		try {
			const map: Map<string, Array<IPayout>> = convertTextToSymbolPayoutMap( inputText );
			setSymbolPayoutsMap( map );
			setAvailableSymbolList( Array.from( map.keys() ) );
			setReelIndexesByAvailableSymbolList( reelIndexes, Array.from( map.keys() ) );
			setIsLegalFormat( true );
		} catch {
			setSymbolPayoutsMap( defaultSymbolPayoutsMap );
			setAvailableSymbolList( defaultAvailableSymbolList );
			setReelIndexes( defaultReelIndexes );
			setIsLegalFormat( false );
		}
	}

	const classes = useStyles();

	return (
		<Box component='form' className={classes.root}>
			<TextField
				fullWidth
				label={'Input NGF format payout...'}
				onChange={handleInputChange}
			/>
			<Causion isLegalFormat={isLegalFormat} />
			<SymbolPayoutViewer
				symbolPayoutsMap={symbolPayoutsMap}
				className={classes.symbolPayoutViewer}
			/>
			<SlotSetting
				availableSymbolList={availableSymbolList}
				reelIndexes={reelIndexes}
				onChange={newReelIndexes => {
					setReelIndexes( newReelIndexes );
				}}
				className={classes.slotSetting}
			/>
			<Result
				reelIndexes={reelIndexes}
				symbolPayoutMap={symbolPayoutsMap}
				bet={bet}
				onBetChange={( newBet ) => {
					setBet( newBet );
				}}
			/>
		</Box>
	);
};

export default WayGamePayoutCalculator;

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

interface CausionProps {
	isLegalFormat: boolean;
}

const Causion: FC<CausionProps> = ( props: CausionProps ) => {
	const { isLegalFormat } = props;

	if ( !isLegalFormat ) {
		return (
			<Typography
				color='error'
				variant={'body1'}
			>
				Symbol payout format is illegal!
			</Typography >
		);
	} else {
		return <Fragment />;
	}
};
