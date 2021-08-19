import React, { FC } from 'react';
import { Box, TextField } from '@material-ui/core';
import { ISymbolPayoutData } from '../../../core/BasicDataInterfaces';
import { IPayout } from '../../../core/NGFDataInterfaces';
import { CopyButton } from '../../../components/buttons/CopyButton';

export interface SymbolPayoutGeneratorResultProps {
	symbolPayoutMap: Map<string, ISymbolPayoutData>;
}

const SymbolPayoutGeneratorResult: FC<SymbolPayoutGeneratorResultProps> = ( props ) => {
	const { symbolPayoutMap } = props;

	const ngfFormatSymbolPayoutsMap: Map<string, Array<IPayout>> = new Map<string, Array<IPayout>>();

	symbolPayoutMap.forEach( ( payoutData, symbol ) => {
		const kindsMultiplierArray: Array<Array<number>> = Array.from( payoutData.kindMultiplierMap.entries() );
		//* Sort array by num (kind).
		kindsMultiplierArray.sort( ( a, b ) => a[ 0 ] - b[ 0 ] );

		const value: Array<IPayout> = kindsMultiplierArray.map( kindsMultiplier => {
			return {
				num: kindsMultiplier[ 0 ],
				multi: kindsMultiplier[ 1 ]
			}
		} )
		ngfFormatSymbolPayoutsMap.set( symbol, value );
	} );

	let index = 0;
	let outputText = '[\n';

	ngfFormatSymbolPayoutsMap.forEach( ( payouts, symbol ) => {
		outputText += `[\n'${ symbol }', \n[\n`
		payouts.forEach( ( payout, index ) => {
			outputText += `{ num: ${ payout.num }, multi: ${ payout.multi } }`
			outputText = index < payouts.length - 1 ? outputText + ',\n' : outputText;
		} );
		outputText += '\n]\n]';
		outputText = index < ngfFormatSymbolPayoutsMap.size - 1 ? outputText + ',\n' : outputText;
		index += 1;
	} );
	outputText += '\n]';

	return (
		<Box>
			<TextField
				variant='filled'
				label='NGF format payout setting'
				fullWidth
				multiline
				rows={15}
				id='symbolPayoutGeneratorResult'
				value={outputText}
			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='symbolPayoutGeneratorResult'
			>
				Copy result
			</CopyButton>
		</Box>
	);
}

export default SymbolPayoutGeneratorResult;