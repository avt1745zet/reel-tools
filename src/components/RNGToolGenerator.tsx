import React, { useState } from 'react';
import { CopyButton } from './CopyButton';

interface ICheckboxesProps {
	selectSymbolList: Array<string>;
	onChange ( index: number, enabled: boolean ): void;
}

interface ISelectProps {
	reelAmount: number;
	symbolAmount: number;
	selectSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange ( posiiton: IVector2, value: string ): void;
}

interface IResultProps {
	reelIndexes: Array<Array<string>>;
}

interface IVector2 {
	x: number;
	y: number;
}

const defaultReelAmount = 5;
const defaultSymbolAmount = 4;

const defaultSelectChecked = true;
const defaultSelectIndex = 0;
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
	const defaultReelIndexes: Array<Array<string>> = new Array<Array<string>>();
	for ( let reelIndex = 0; reelIndex < reelAmount; reelIndex++ ) {
		defaultReelIndexes.push( [] );
		for ( let symbolIndex = 0; symbolIndex < symbolAmount; symbolIndex++ ) {
			const symbolName = selectSymbolList[ defaultSelectIndex ];
			defaultReelIndexes[ reelIndex ].push( symbolName );
		}
	}
	const [ reelIndexes, setReelIndexes ] = useState( defaultReelIndexes );

	return <form className='row'>
		<label>
			Generator
		</label>
		<div className='col-md-6 col-sm-12'>
			<label htmlFor='reelAmountInput' className='col-6'>
				Reel amount
			</label>
			<input id='reelAmountInput' defaultValue={reelAmount} min='1' type='number' className='col-6' onChange={event => {
				const newReelAmount = Number.parseInt( event.target.value );
				const add = newReelAmount > reelAmount;
				setReelAmount( newReelAmount );

				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				if ( add ) {
					newReelIndexes.push( newReelIndexes[ 0 ].map( () => selectSymbolList[ 0 ] ) );
				} else {
					newReelIndexes.splice( newReelIndexes.length - 1 );
				}
				setReelIndexes( newReelIndexes );
			}} />
		</div>
		<div className='col-md-6 col-sm-12'>
			<label htmlFor='symbolAmountInput' className='col-6'>
				Symbol amount
			</label>
			<input id='symbolAmountInput' defaultValue={symbolAmount} min='1' type='number' className='col-6' onChange={event => {
				const newSymbolAmount = Number.parseInt( event.target.value );
				const add = newSymbolAmount > symbolAmount;
				setSymbolAmount( newSymbolAmount );

				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				if ( add ) {
					newReelIndexes.forEach( reel => {
						reel.push( selectSymbolList[ 0 ] );
					} );
				} else {
					newReelIndexes.forEach( reel => {
						reel.splice( reel.length - 1 );
					} );
				}
				setReelIndexes( newReelIndexes );
			}} />
		</div>
		<div className='col-12'>
			<Checkboxes selectSymbolList={selectSymbolList} onChange={( index, enabled ) => {
				const newSelectSymbolList: Array<string> = selectSymbolList.slice();
				if ( enabled ) {
					newSelectSymbolList.push( defaultSelectSymbolList[ index ] );
				} else {
					newSelectSymbolList.splice( newSelectSymbolList.findIndex( symbol => symbol === defaultSelectSymbolList[ index ] ), 1 );
				}
				newSelectSymbolList.sort( ( a, b ) =>
					defaultSelectSymbolList.findIndex( symbol => symbol === a ) - defaultSelectSymbolList.findIndex( symbol => symbol === b ) );
				setSelectSymbolList( newSelectSymbolList );

				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				newReelIndexes.forEach( ( reel, reelIndex ) => {
					reel.forEach( ( symbol, symbolIndex ) => {
						const isSymbolOutOfRange = !newSelectSymbolList.includes( symbol );
						if ( isSymbolOutOfRange ) {
							newReelIndexes[ reelIndex ][ symbolIndex ] = newSelectSymbolList[ 0 ];
						}
					} )
				} );
				setReelIndexes( newReelIndexes );
			}} />
		</div>
		<SelectsTable reelIndexes={reelIndexes} reelAmount={reelAmount} symbolAmount={symbolAmount} selectSymbolList={selectSymbolList} onChange={( position, value ) => {
			const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
			newReelIndexes[ position.x ][ position.y ] = value;
			setReelIndexes( newReelIndexes );
		}} />
		<Result reelIndexes={reelIndexes}></Result>
	</form>
};

const Checkboxes: React.FC<ICheckboxesProps> = ( props: ICheckboxesProps ) => {
	const checkboxes: Array<JSX.Element> = [];
	defaultSelectSymbolList.forEach( ( symbol, index ) => {
		checkboxes.push(
			<div key={index} className='col-2'>
				<input type='checkbox' className='form-check-input' id={'symbolCheckbox' + index} data-index={index} defaultChecked={defaultSelectChecked} onChange={event => {
					const index = event.target.dataset.index ? Number.parseInt( event.target.dataset.index ) : 0;
					props.onChange( index, event.target.checked );
				}} />
				<label key={'symbolCheckbox' + index} className='form-check-label' htmlFor={'symbolCheckbox' + index}>
					{symbol}
				</label>
			</div>
		)
	} );
	return <div className='row'>
		{checkboxes}
	</div>;
}

const SelectsTable: React.FC<ISelectProps> = ( props: ISelectProps ) => {
	const trs: Array<JSX.Element> = [];
	for ( let symbolIndex = 0; symbolIndex < props.symbolAmount; symbolIndex++ ) {
		const tds: Array<JSX.Element> = [];
		for ( let reelIndex = 0; reelIndex < props.reelAmount; reelIndex++ ) {
			const options: Array<JSX.Element> = [];
			props.selectSymbolList.forEach( symbol => {
				options.push(
					<option key={symbol} value={symbol}>{symbol}</option>
				);
			} )
			tds.push(
				<td key={'r' + reelIndex} >
					<select value={props.reelIndexes[ reelIndex ][ symbolIndex ]} className='form-select' data-reelindex={reelIndex} data-symbolindex={symbolIndex} onChange={event => {
						const position: IVector2 = {
							x: event.target.dataset.reelindex ? Number.parseInt( event.target.dataset.reelindex ) : 0,
							y: event.target.dataset.symbolindex ? Number.parseInt( event.target.dataset.symbolindex ) : 0
						};
						const symbol: string = event.target.value;
						props.onChange( position, symbol );
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
		<table className='container-fluid'>
			<tbody>
				{trs}
			</tbody>
		</table>
	</div>;
}

const Result: React.FC<IResultProps> = ( props: IResultProps ) => {
	let code = 'rngTool.setRngSpinData([\n[\n';
	for ( let reelIndex = 0; reelIndex < props.reelIndexes.length; reelIndex++ ) {
		let reelText = '[ ';
		for ( let symbolIndex = 0; symbolIndex < props.reelIndexes[ reelIndex ].length; symbolIndex++ ) {
			const symbol = props.reelIndexes[ reelIndex ][ symbolIndex ];
			reelText = reelText.concat( '"' + symbol + '"' );
			if ( symbolIndex !== props.reelIndexes[ reelIndex ].length - 1 ) {
				reelText = reelText.concat( ', ' );
			}
		}
		reelText = reelText.concat( ' ]' );
		if ( reelIndex !== props.reelIndexes.length - 1 ) {
			reelText = reelText.concat( ',\n' );
		}
		code = code.concat( reelText );
	}
	code = code.concat( '\n]\n]);' );
	return <div className='col-12'>
		<div className='form-group row'>
			<div className='col-12'>
				<textarea rows={15} id='rngToolResult' className='form-control' value={code} readOnly></textarea>
			</div>
			<CopyButton style='btn btn-light col-12' targetElementId='rngToolResult' />
		</div>
	</div>
}