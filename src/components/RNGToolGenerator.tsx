import React, { useState } from 'react';
import { CopyButton } from './CopyButton';

interface ICheckboxesProps {
	originalSelectOptionList: Array<ISelectStatu>;
	customSelectOptionList: Array<ISelectStatu>;
	onOriginalCheckedChange ( index: number, checked: boolean ): void;
	onCustomCheckedChange ( index: number, checked: boolean ): void;
	onCustomSymbolChange ( index: number, newSymbolName: string ): void;
	onAddNewCustomSymbol ( symbolName: string, defaultChecked: boolean ): void;
}

interface ISelectTableProps {
	reelAmount: number;
	symbolAmount: number;
	availableSymbolList: Array<string>;
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

interface ISelectStatu {
	symbol: string;
	checked: boolean;
}

const defaultReelAmount = 5;
const defaultSymbolAmount = 4;

const defaultSelectIndex = 0;
const defaultSelectOptionList: Array<ISelectStatu> = [
	{
		symbol: 'PIC1',
		checked: true
	},
	{
		symbol: 'PIC2',
		checked: true
	},
	{
		symbol: 'PIC3',
		checked: true
	},
	{
		symbol: 'PIC4',
		checked: true
	},
	{
		symbol: 'PIC5',
		checked: false
	},
	{
		symbol: 'PIC6',
		checked: false
	},
	{
		symbol: 'A',
		checked: true
	},
	{
		symbol: 'K',
		checked: true
	},
	{
		symbol: 'Q',
		checked: true
	},
	{
		symbol: 'J',
		checked: true
	},
	{
		symbol: 'T',
		checked: false
	},
	{
		symbol: 'N',
		checked: false
	},
	{
		symbol: 'WILD',
		checked: true
	},
	{
		symbol: 'SCATTER',
		checked: true
	}
]

export const RNGToolGenerator: React.FC = () => {
	const [ reelAmount, setReelAmount ] = useState( defaultReelAmount );
	const [ symbolAmount, setSymbolAmount ] = useState( defaultSymbolAmount );

	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( new Array<ISelectStatu>() );

	const defaultAvailableSymbolList: Array<string> = new Array<string>();
	defaultSelectOptionList.forEach( selectOption => {
		if ( selectOption.checked ) {
			defaultAvailableSymbolList.push( selectOption.symbol );
		}
	} );
	const [ availableSymbolList, setAvailableSymbolList ] = useState( getCheckedSymbol( defaultSelectOptionList ) );

	const defaultReelIndexes: Array<Array<string>> = new Array<Array<string>>();
	for ( let reelIndex = 0; reelIndex < reelAmount; reelIndex++ ) {
		defaultReelIndexes.push( [] );
		for ( let symbolIndex = 0; symbolIndex < symbolAmount; symbolIndex++ ) {
			const symbolName = availableSymbolList[ defaultSelectIndex ];
			defaultReelIndexes[ reelIndex ].push( symbolName );
		}
	}
	const [ reelIndexes, setReelIndexes ] = useState( defaultReelIndexes );

	return <form className='row'>
		<label>
			Generator
		</label>
		<div className='col-12'>
			<div className='row'>
				<div className='col-md-3 col-sm-6'>
					<label htmlFor='reelAmountInput'>
						Reel amount
					</label>
				</div>
				<div className='col-md-3 col-sm-6'>
					<input id='reelAmountInput' defaultValue={reelAmount} min='1' type='number' className='form-control' onChange={event => {
						const newReelAmount = Number.parseInt( event.target.value );
						const add = newReelAmount > reelAmount;
						setReelAmount( newReelAmount );

						const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
						if ( add ) {
							newReelIndexes.push( newReelIndexes[ 0 ].map( () => availableSymbolList[ 0 ] ) );
						} else {
							newReelIndexes.splice( newReelIndexes.length - 1 );
						}
						setReelIndexes( newReelIndexes );
					}} />
				</div>
				<div className='col-md-3 col-sm-6'>
					<label htmlFor='symbolAmountInput'>
						Row amount
					</label>
				</div>
				<div className='col-md-3 col-sm-6'>
					<input id='symbolAmountInput' defaultValue={symbolAmount} min='1' type='number' className='form-control' onChange={event => {
						const newSymbolAmount = Number.parseInt( event.target.value );
						const add = newSymbolAmount > symbolAmount;
						setSymbolAmount( newSymbolAmount );

						const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
						if ( add ) {
							newReelIndexes.forEach( reel => {
								reel.push( availableSymbolList[ 0 ] );
							} );
						} else {
							newReelIndexes.forEach( reel => {
								reel.splice( reel.length - 1 );
							} );
						}
						setReelIndexes( newReelIndexes );
					}} />
				</div>
			</div>
		</div>
		<div className='col-12'>
			<Checkboxes originalSelectOptionList={originalSelectOptionList} customSelectOptionList={customSelectOptionList}
				onOriginalCheckedChange={( index, checked ) => {
					const newOriginalSelectOptionList: Array<ISelectStatu> = originalSelectOptionList.slice();
					newOriginalSelectOptionList[ index ].checked = checked;
					setOriginalSelectOptionList( newOriginalSelectOptionList );

					const newSelectSymbolList = [ ...getCheckedSymbol( newOriginalSelectOptionList ), ...getCheckedSymbol( customSelectOptionList ) ];
					setAvailableSymbolList( newSelectSymbolList );

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
				}} onCustomCheckedChange={( index, checked ) => {
					const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
					newCustomSelectOptionList[ index ].checked = checked;
					setCustomSelectOptionList( newCustomSelectOptionList );

					const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
					setAvailableSymbolList( newSelectSymbolList )

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
				}} onCustomSymbolChange={( index, newSymbolName ) => {
					newSymbolName = newSymbolName.toUpperCase();
					const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
					newCustomSelectOptionList[ index ] = { symbol: newSymbolName, checked: newCustomSelectOptionList[ index ].checked };
					setCustomSelectOptionList( newCustomSelectOptionList );

					const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
					setAvailableSymbolList( newSelectSymbolList )

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
				}} onAddNewCustomSymbol={( symbolName, checked ) => {
					const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
					newCustomSelectOptionList.push( { symbol: symbolName, checked: checked } );
					setCustomSelectOptionList( newCustomSelectOptionList );

					const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
					setAvailableSymbolList( newSelectSymbolList )
				}} />
		</div>
		<SelectsTable reelIndexes={reelIndexes} reelAmount={reelAmount} symbolAmount={symbolAmount} availableSymbolList={availableSymbolList} onChange={( position, value ) => {
			const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
			newReelIndexes[ position.x ][ position.y ] = value;
			setReelIndexes( newReelIndexes );
		}} />
		<Result reelIndexes={reelIndexes}></Result>
	</form>
};

function getCheckedSymbol ( options: Array<ISelectStatu> ): Array<string> {
	const result: Array<string> = new Array<string>();
	options.forEach( selectOption => {
		if ( selectOption.checked ) {
			result.push( selectOption.symbol );
		}
	} );
	return result;
}

const Checkboxes: React.FC<ICheckboxesProps> = ( props: ICheckboxesProps ) => {
	const originalCheckboxes: Array<JSX.Element> = props.originalSelectOptionList.map( ( selectOption, index ) => {
		const checked = selectOption.checked;
		const symbol = selectOption.symbol;
		return <div key={index} className='col-2'>
			<input type='checkbox' className='form-check-input' id={'symbolCheckbox' + index} data-index={index} checked={checked} onChange={event => {
				const index = event.target.dataset.index ? Number.parseInt( event.target.dataset.index ) : 0;
				props.onOriginalCheckedChange( index, event.target.checked );
			}} />
			<label key={'symbolCheckbox' + index} className='form-check-label' htmlFor={'symbolCheckbox' + index}>
				{symbol}
			</label>
		</div>
	} );

	const customCheckboxes: Array<JSX.Element> = props.customSelectOptionList.map( ( selectOption, index ) => {
		const checked = selectOption.checked;
		const symbol = selectOption.symbol;
		return <div key={'custom' + index} className='col-2'>
			<div className='input-group'>
				<input type='checkbox' className='form-check-input' data-index={index} checked={checked} onChange={event => {
					const index = event.target.dataset.index ? Number.parseInt( event.target.dataset.index ) : 0;
					props.onCustomCheckedChange( index, event.target.checked );
				}} />
				<input key={'symbolCheckbox' + index} className='form-control' value={symbol} onChange={event => {
					props.onCustomSymbolChange( index, event.target.value );
				}} />
			</div>
		</div>
	} );

	return <div className='row'>
		{originalCheckboxes}
		{customCheckboxes}
		<button type='button' className='btn col-1' title='Apply custom symbol' onClick={() => {
			props.onAddNewCustomSymbol( '', true );
		}}><i className='fas fa-plus' aria-hidden='true'></i></button>
	</div>;
}

const SelectsTable: React.FC<ISelectTableProps> = ( props: ISelectTableProps ) => {
	const trs: Array<JSX.Element> = [];
	for ( let symbolIndex = 0; symbolIndex < props.symbolAmount; symbolIndex++ ) {
		const tds: Array<JSX.Element> = [];
		for ( let reelIndex = 0; reelIndex < props.reelAmount; reelIndex++ ) {
			const options: Array<JSX.Element> = [];
			props.availableSymbolList.forEach( ( symbol, index ) => {
				options.push(
					<option key={index} value={symbol}>{symbol}</option>
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