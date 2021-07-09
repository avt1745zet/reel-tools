import React, { useState } from 'react';
import { CopyButton } from './CopyButton';

interface ICheckboxesProps {
	selectSymbolList: Array<string>;
	onChange ( output: Array<string> ): void;
}

interface ISelectProps {
	reelAmount: number;
	symbolAmount: number;
	selectSymbolList: Array<string>;
	onChange ( output: Array<Array<string>> ): void;
}

const defaultReelAmount = 5;
const defaultSymbolAmount = 4;

const defaultSelectChecked = true;
const defaultSelectSymbolList: Array<string> = [
	'PIC1',
	'PIC2',
	'PIC3',
	'PIC4',
	'PIC5',
	'PIC6',
	'A',
	'K',
	'Q',
	'J',
	'T',
	'N',
	'WILD',
	'SCATTER'
]

export const RNGToolGenerator: React.FC = () => {
	const [ reelAmount, setReelAmount ] = useState( defaultReelAmount );
	const [ symbolAmount, setSymbolAmount ] = useState( defaultSymbolAmount );
	const [ selectSymbolList, setSelectSymbolList ] = useState( defaultSelectChecked ? defaultSelectSymbolList : new Array<string>() );
	const [ rngToolCode, setRngToolCode ] = useState( '' );

	return <form className='row'>
		<label>
			Generator
		</label>
		<div className='col-md-6 col-sm-12'>
			<label htmlFor='reelAmountInput' className='col-6'>
				Reel amount
			</label>
			<input id='reelAmountInput' defaultValue={reelAmount} min='1' type='number' className='col-6' onChange={element => {
				setReelAmount( Number.parseInt( element.target.value ) );
			}} />
		</div>
		<div className='col-md-6 col-sm-12'>
			<label htmlFor='symbolAmountInput' className='col-6'>
				Symbol amount
			</label>
			<input id='symbolAmountInput' defaultValue={symbolAmount} min='1' type='number' className='col-6' onChange={element => {
				setSymbolAmount( Number.parseInt( element.target.value ) );
			}} />
		</div>
		<div className='col-12'>
			<Checkboxes selectSymbolList={selectSymbolList} onChange={newList => {
				setSelectSymbolList( newList );
			}} />
		</div>
		<SelectsTable reelAmount={reelAmount} symbolAmount={symbolAmount} selectSymbolList={selectSymbolList} onChange={output => {
			let code = 'rngTool.setRngSpinData([\n[\n';
			for ( let reelIndex = 0; reelIndex < output.length; reelIndex++ ) {
				let reelText = '[ ';
				for ( let symbolIndex = 0; symbolIndex < output[ reelIndex ].length; symbolIndex++ ) {
					const symbolName: HTMLInputElement = document.getElementById( reelIndex + ',' + symbolIndex ) as HTMLInputElement;
					reelText = reelText.concat( '"' + symbolName.value + '"' );
					if ( symbolIndex !== output[ reelIndex ].length - 1 ) {
						reelText = reelText.concat( ', ' );
					}
				}
				reelText = reelText.concat( ' ]' );
				if ( reelIndex !== output.length - 1 ) {
					reelText = reelText.concat( ',\n' );
				}
				code = code.concat( reelText );
			}
			code = code.concat( '\n]\n]);' )
			setRngToolCode( code );
		}} />
		<div className='col-12'>
			<textarea rows={15} id='rngToolResult' className='form-control' value={rngToolCode} readOnly></textarea>
		</div>
		<CopyButton style='btn btn-light col-12' targetElementId='rngToolResult' />
	</form>
};

const Checkboxes: React.FC<ICheckboxesProps> = ( props: ICheckboxesProps ) => {
	const checkboxes: Array<JSX.Element> = [];
	defaultSelectSymbolList.forEach( ( symbol, index ) => {
		checkboxes.push(
			<div key={index} className='col-2'>
				<input type='checkbox' className='form-check-input' id={'symbolCheckbox' + index} title={symbol} defaultChecked={defaultSelectChecked} onChange={event => {
					const symbol = event.target.title;
					const newList = props.selectSymbolList.slice();
					if ( event.target.checked ) { //* Add
						newList.push( symbol );
					} else { //* Remove
						const index = props.selectSymbolList.findIndex( selectSymbol => selectSymbol === symbol );
						newList.splice( index, 1 );
					}
					props.onChange( newList );
				}} />
				<label key={'symbolCheckbox' + index} className='form-check-label' htmlFor={'symbolCheckbox' + index}>
					{symbol}
				</label>
			</div>
		)
	} );
	return <div className='row'>{checkboxes}</div>;
}

const SelectsTable: React.FC<ISelectProps> = ( props: ISelectProps ) => {
	const trs: Array<JSX.Element> = []
	for ( let symbolIndex = 0; symbolIndex < props.symbolAmount; symbolIndex++ ) {
		const tds: Array<JSX.Element> = []
		for ( let reelIndex = 0; reelIndex < props.reelAmount; reelIndex++ ) {
			const options: Array<JSX.Element> = [];
			props.selectSymbolList.forEach( symbol => {
				options.push(
					<option key={symbol} value={symbol}>{symbol}</option>
				)
			} )
			tds.push(
				<td key={'r' + reelIndex} className='col-1'>
					<select className='form-select' id={reelIndex + ',' + symbolIndex} onChange={() => {
						const output: Array<Array<string>> = [];
						for ( let reelIndex = 0; reelIndex < props.reelAmount; reelIndex++ ) {
							output.push( [] );
							for ( let symbolIndex = 0; symbolIndex < props.symbolAmount; symbolIndex++ ) {
								const symbolName: HTMLInputElement = document.getElementById( reelIndex + ',' + symbolIndex ) as HTMLInputElement;
								output[ reelIndex ].push( symbolName.value );
							}
						}
						props.onChange( output );
					}}>
						{options}
					</select>
				</td>
			)
		}
		trs.push(
			<tr key={'s' + symbolIndex}>
				{tds}
			</tr>
		);
	}
	return <div className='col-12'>
		<table className='col-12'>
			<tbody>
				{trs}
			</tbody>
		</table>
	</div>;
}