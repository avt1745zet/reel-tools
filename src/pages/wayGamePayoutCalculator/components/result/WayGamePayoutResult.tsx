import React, { FC } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';
import { IWinLineData } from '../../../../core/BasicDataInterfaces';
import { IPayout } from '../../../../core/NGFDataInterfaces';

export interface WayGamePayoutResultProps {
	reelIndexes: Array<Array<string>>;
	symbolPayoutMap: Map<string, Array<IPayout>>;
	bet: number;
	onBetChange?( newBet: number ): void;
}

const WayGamePayoutResult: FC<WayGamePayoutResultProps> = ( props: WayGamePayoutResultProps ) => {
	const { reelIndexes, symbolPayoutMap, bet, onBetChange } = props;
	//* Multiply the number of symbols on each reels.
	const wayCount: number = reelIndexes.map( symbols => symbols.length ).reduce( ( a, b ) => a * b );

	const winLines: Array<IWinLineData> = getWinLines( reelIndexes, symbolPayoutMap, bet );
	const scatterWins: Array<IWinLineData> = getScatterWin( reelIndexes, symbolPayoutMap, bet );

	const totalWinText: string = winLines.length > 0 ? winLines.map( winline => winline.prize ).reduce( ( a, b ) => a + b ).toFixed( 2 ) : ( 0 ).toFixed( 2 );

	const getLineConfigText = ( lineConfig: Array<Array<number>> ): string => {
		let result = '';
		lineConfig.forEach( reel => {
			let content = '';
			if ( reel.length > 0 ) {
				content = reel.map( symbol => symbol.toString() ).join();
			} else {
				content = '*';
			}
			result += `[${ content }]`;
		} );
		return result;
	}

	const eachLineWinText: string = winLines.length > 0
		? winLines.map( winline => (
			'symbol: ' + winline.symbol +
			', kinds: ' + winline.kinds +
			', prize: ' + winline.prize.toFixed( 2 ) +
			', line: ' + getLineConfigText( winline.lineConfig )
		) ).reduce( ( a, b ) => a + '\n' + b )
		: '';

	const eachScatterWinText: string = scatterWins.length > 0
		? scatterWins.map( winline => (
			'symbol: ' + winline.symbol +
			', kinds: ' + winline.kinds +
			', prize: ' + winline.prize.toFixed( 2 ) +
			', line: ' + getLineConfigText( winline.lineConfig )
		) ).reduce( ( a, b ) => a + '\n' + b )
		: '';

	const handleBetChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		if ( onBetChange ) {
			const value: string = event.target.value;
			let bet: number = Number.parseFloat( value );
			const isValidBet = !Number.isNaN( bet );
			if ( !isValidBet ) {
				bet = 0;
			}
			onBetChange( bet );
		}
	}

	return (
		<Box>
			<Typography
				variant='h4'
				align='center'
			>
				{wayCount} Ways
			</Typography>
			<TextField
				type='number'
				label='Bet'
				fullWidth
				inputProps={{
					min: 0,
					step: 0.1
				}}
				margin='normal'
				value={bet}
				onChange={handleBetChange}
			/>
			<TextField
				fullWidth
				multiline
				inputProps={{ readOnly: true }}
				variant='filled'
				label='Output result'
				value={
					'Total Win: ' + totalWinText + '\n\n' +
					( eachScatterWinText ? 'Scatter win list:\n' + eachScatterWinText + '\n\n' : '' ) +
					( eachLineWinText ? 'Line win list:\n' + eachLineWinText : '' )
				}
			/>
		</Box>
	);
};

export default WayGamePayoutResult;

const getWinLines = ( reelIndexes: Array<Array<string>>, symbolPayoutMap: Map<string, Array<IPayout>>, bet: number, reelIndex = 0, winSymbol = '', lastLineConfig: Array<Array<number>> = [] ): Array<IWinLineData> => {
	let result: Array<IWinLineData> = new Array<IWinLineData>();

	const createWinLine = ( symbolPayoutMap: Map<string, Array<IPayout>>, bet: number, symbol: string, winLine: Array<Array<number>>, reelCount: number ): IWinLineData | undefined => {
		let result: IWinLineData | undefined = undefined;

		const payouts: Array<IPayout> | undefined = symbolPayoutMap.get( symbol );
		const kinds: number = winLine.length;
		const lineConfig: Array<Array<number>> = new Array<Array<number>>( reelCount )
		for ( let reelIndex = 0; reelIndex < lineConfig.length; reelIndex++ ) {
			if ( winLine[ reelIndex ] ) {
				lineConfig[ reelIndex ] = winLine[ reelIndex ];
			} else {
				lineConfig[ reelIndex ] = [];
			}
		}

		if ( payouts ) {
			const payout: IPayout | undefined = payouts.find( payout => payout.num === kinds );
			if ( payout ) {
				let multiplier: number = payout.multi;
				multiplier = multiplier ? multiplier : 0;
				const prize: number = getPrize( bet, multiplier );
				result = {
					lineConfig: lineConfig,
					kinds: kinds,
					symbol: symbol,
					prize: prize
				};
			}
		}
		return result;
	};

	let hasAnyWin = false;
	reelIndexes[ reelIndex ].forEach( ( symbol, symbolIndex ) => {
		let newWinSymbol = '';
		if ( reelIndex === 0 ) {
			newWinSymbol = symbol;
		} else if ( winSymbol === 'WILD' && symbol !== 'WILD' ) {
			//* If previous symbol all wild, newWinSymbol = symbol.
			newWinSymbol = symbol;
		} else {
			newWinSymbol = winSymbol;
		}

		const isSymbolMatched: boolean = newWinSymbol === symbol;

		if ( ( isSymbolMatched || symbol === 'WILD' ) && symbol !== 'SCATTER' ) {
			hasAnyWin = true;
			const newLineConfig: Array<Array<number>> = [ ...lastLineConfig, [ symbolIndex ] ];
			const nextReelIndex: number = reelIndex + 1;

			if ( nextReelIndex < reelIndexes.length ) {
				result = result.concat( getWinLines( reelIndexes, symbolPayoutMap, bet, nextReelIndex, newWinSymbol, newLineConfig ) );
			} else {
				const winLine: IWinLineData | undefined = createWinLine( symbolPayoutMap, bet, newWinSymbol, newLineConfig, reelIndexes.length );
				if ( winLine ) {
					result.push( winLine );
				}
			}
		}
	} );

	if ( !hasAnyWin ) { //* no any win on this reelIndex
		const winLine: IWinLineData | undefined = createWinLine( symbolPayoutMap, bet, winSymbol, lastLineConfig, reelIndexes.length );
		if ( winLine ) {
			result.push( winLine );
		}
	}
	return result;
};

const getPrize = ( bet: number, multiplier: number ): number => {
	const result: number = bet * multiplier;
	return result;
};

const getScatterWin = ( reelIndexes: Array<Array<string>>, symbolPayoutMap: Map<string, Array<IPayout>>, bet: number ): Array<IWinLineData> => {
	const result: Array<IWinLineData> = new Array<IWinLineData>();

	const createScatterWinLine = ( symbolPayoutMap: Map<string, Array<IPayout>>, bet: number, symbol: string, winLine: Array<Array<number>>, reelCount: number ): IWinLineData | undefined => {
		let result: IWinLineData | undefined = undefined;

		const payouts: Array<IPayout> | undefined = symbolPayoutMap.get( symbol );
		const kinds: number = winLine.reduce( ( a, b ) => a.concat( b ) ).length;
		const lineConfig: Array<Array<number>> = new Array<Array<number>>( reelCount )
		for ( let reelIndex = 0; reelIndex < lineConfig.length; reelIndex++ ) {
			if ( winLine[ reelIndex ] ) {
				lineConfig[ reelIndex ] = winLine[ reelIndex ];
			} else {
				lineConfig[ reelIndex ] = [];
			}
		}

		if ( payouts ) {
			const payout: IPayout | undefined = payouts.find( payout => payout.num === kinds );
			if ( payout ) {
				let multiplier: number = payout.multi;
				multiplier = multiplier ? multiplier : 0;
				const prize: number = getPrize( bet, multiplier );
				result = {
					lineConfig: lineConfig,
					kinds: kinds,
					symbol: symbol,
					prize: prize
				};
			}
		}
		return result;
	};

	const scatterWinLineMap: Map<string, Array<Array<number>>> = new Map<string, Array<Array<number>>>();

	reelIndexes.forEach( ( reel, reelIndex ) => {
		reel.forEach( ( symbol, symbolIndex ) => {
			const isScatter: boolean = symbol === 'SCATTER';
			if ( isScatter ) {
				let lineConfig: Array<Array<number>> | undefined = scatterWinLineMap.get( symbol );
				if ( !lineConfig ) {
					lineConfig = [];
				}
				if ( !lineConfig[ reelIndex ] ) {
					lineConfig[ reelIndex ] = [];
				}
				lineConfig[ reelIndex ].push( symbolIndex );
				scatterWinLineMap.set( symbol, lineConfig );
			}
		} );
	} );

	scatterWinLineMap.forEach( ( value, key ) => {
		const winLine: IWinLineData | undefined = createScatterWinLine( symbolPayoutMap, bet, key, value, reelIndexes.length );
		if ( winLine ) {
			result.push( winLine );
		}
	} );

	return result;
};