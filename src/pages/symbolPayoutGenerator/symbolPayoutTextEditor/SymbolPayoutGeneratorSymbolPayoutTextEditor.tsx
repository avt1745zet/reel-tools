import React, { ChangeEvent, FC, useState, useEffect } from 'react';
import { Box, TextField } from '@material-ui/core';
import { ISymbolPayoutData } from '../../../core/BasicDataInterfaces';
import { IPayout } from '../../../core/SlotGameDataInterfaces';
import { CopyButton } from '../../../components/buttons/CopyButton';

export interface SymbolPayoutGeneratorResultProps {
	symbolPayoutMap: Map<string, ISymbolPayoutData>;
	onTextChange?( text: string ): void;
}

const SymbolPayoutGeneratorSymbolPayoutTextEditor: FC<SymbolPayoutGeneratorResultProps> = ( props ) => {
	const { symbolPayoutMap, onTextChange } = props;

	const [ outputText, setOutputText ] = useState( '' );

	useEffect( () => {
		const slotGameFormatSymbolPayoutsMap: Map<string, Array<IPayout>> = new Map<string, Array<IPayout>>();

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
			slotGameFormatSymbolPayoutsMap.set( symbol, value );
		} );

		let index = 0;
		let newOutputText = '[\n';

		slotGameFormatSymbolPayoutsMap.forEach( ( payouts, symbol ) => {
			newOutputText += `[\n'${ symbol }', \n[\n`
			payouts.forEach( ( payout, index ) => {
				newOutputText += `{ num: ${ payout.num }, multi: ${ payout.multi } }`
				newOutputText = index < payouts.length - 1 ? newOutputText + ',\n' : newOutputText;
			} );
			newOutputText += '\n]\n]';
			newOutputText = index < slotGameFormatSymbolPayoutsMap.size - 1 ? newOutputText + ',\n' : newOutputText;
			index += 1;
		} );
		newOutputText += '\n]';

		setOutputText( newOutputText );
		if ( onTextChange ) {
			onTextChange( newOutputText );
		}
	}, [ symbolPayoutMap, onTextChange ] );

	const handleTextFieldChange = ( event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const value = event.target.value;
		setOutputText( value );
		if ( onTextChange ) {
			onTextChange( value );
		}
	};

	return (
		<Box>
			<TextField
				variant='filled'
				fullWidth
				multiline
				minRows={15}
				maxRows={15}
				id='symbolPayoutGenerator-SymbolPayoutTextEditor-TextField'
				value={outputText}
				onChange={handleTextFieldChange}
			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='symbolPayoutGenerator-SymbolPayoutTextEditor-TextField'
			>
				Copy result
			</CopyButton>
		</Box>
	);
}

export default SymbolPayoutGeneratorSymbolPayoutTextEditor;