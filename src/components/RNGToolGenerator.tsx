import React, { FC, ReactElement, useState } from 'react';
import { Checkbox, Divider, FormControl, FormControlLabel, IconButton, MenuItem, Select, Box, createStyles, Grid, makeStyles, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CopyButton } from './CopyButton';

interface CheckboxesProps {
	originalSelectOptionList: Array<ISelectStatu>;
	customSelectOptionList: Array<ISelectStatu>;
	onOriginalCheckedChange ( index: number, checked: boolean ): void;
	onCustomCheckedChange ( index: number, checked: boolean ): void;
	onCustomSymbolChange ( index: number, newSymbolName: string ): void;
	onAddNewCustomSymbol ( symbolName: string, defaultChecked: boolean ): void;
}

interface SelectTableProps {
	reelAmount: number;
	symbolAmount: number;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange ( posiiton: IVector2, value: string ): void;
}

interface ResultProps {
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

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		formControlLabelWithAddButton: {
			marginRight: '0px'
		},
		divider: {
			marginBlock: '10px',
			height: 0
		}
	} ),
);

export const RNGToolGenerator: FC = () => {
	const [ reelAmount, setReelAmount ] = useState( defaultReelAmount );
	const [ symbolAmount, setSymbolAmount ] = useState( defaultSymbolAmount );

	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( [ { symbol: '', checked: false } ] );

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

	const classes = useStyles();

	return (
		<form className={classes.root} >
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TextField type='number' value={reelAmount} fullWidth label='Reel amount' onChange={( event ) => {
						const newReelAmount = Number.parseInt( event.target.value );
						if ( isPositiveInteger( newReelAmount ) ) {
							const add = newReelAmount > reelAmount;
							setReelAmount( newReelAmount );

							const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
							if ( add ) {
								newReelIndexes.push( newReelIndexes[ 0 ].map( () => availableSymbolList[ 0 ] ) );
							} else {
								newReelIndexes.splice( newReelIndexes.length - 1 );
							}
							setReelIndexes( newReelIndexes );
						}
					}} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField type='number' value={symbolAmount} fullWidth label='Row amount' onChange={( event ) => {
						const newSymbolAmount = Number.parseInt( event.target.value );
						if ( isPositiveInteger( newSymbolAmount ) ) {
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
						}
					}} />
				</Grid>
			</Grid>
			<Divider className={classes.divider} />
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
					const newChecked = newSymbolName === '' ? false : newCustomSelectOptionList[ index ].checked;
					newCustomSelectOptionList[ index ] = { symbol: newSymbolName, checked: newChecked };
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
			<Divider className={classes.divider} />
			<SelectsTable reelIndexes={reelIndexes} reelAmount={reelAmount} symbolAmount={symbolAmount} availableSymbolList={availableSymbolList} onChange={( position, value ) => {
				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				newReelIndexes[ position.x ][ position.y ] = value;
				setReelIndexes( newReelIndexes );
			}} />
			<Divider className={classes.divider} />
			<Result reelIndexes={reelIndexes}></Result>
		</form>
	);
};

function isPositiveInteger ( value: number ): boolean {
	const result: boolean = Number.isInteger( value ) && value > 0 ? true : false;
	return result;
}

function getCheckedSymbol ( options: Array<ISelectStatu> ): Array<string> {
	const result: Array<string> = new Array<string>();
	options.forEach( selectOption => {
		if ( selectOption.checked ) {
			result.push( selectOption.symbol );
		}
	} );
	return result;
}

const Checkboxes: FC<CheckboxesProps> = ( props: CheckboxesProps ) => {
	const { originalSelectOptionList, customSelectOptionList, onOriginalCheckedChange, onCustomCheckedChange, onCustomSymbolChange, onAddNewCustomSymbol } = props;

	const classes = useStyles();

	const originalCheckboxes: Array<ReactElement> = originalSelectOptionList.map( ( selectOption, index ) => {
		const checked = selectOption.checked;
		const symbol = selectOption.symbol;

		const handleCheckboxChange = ( index: number ) => ( event: React.ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			onOriginalCheckedChange( index, checked );
		};

		return (
			<Grid item key={index} xs={6} sm={4} md={3} lg={2}>
				<FormControlLabel
					control={<Checkbox color='primary' checked={checked} onChange={( handleCheckboxChange( index ) )} />}
					label={symbol}
				/>
			</Grid>
		)
	} );

	const customCheckboxes: Array<ReactElement> = customSelectOptionList.map( ( selectOption, index ) => {
		const checked = selectOption.checked;
		const symbol = selectOption.symbol;

		const handleCheckboxChange = ( index: number ) => ( event: React.ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			onCustomCheckedChange( index, checked );
		};

		const checkbox: ReactElement =
			<Checkbox
				key='checkbox'
				color='primary'
				checked={checked}
				onChange={handleCheckboxChange( index )}
				disabled={symbol === ''}
			/>;

		const textField: ReactElement = <Box sx={{ display: 'inline-flex' }} >
			<TextField
				key='textField'
				label='Custom symbol'
				placeholder='Define symbol...'
				value={symbol}
				onChange={event => {
					onCustomSymbolChange( index, event.target.value );
				}}
			/>
		</Box>

		const isLastOption: boolean = index === customSelectOptionList.length - 1;

		const elements: ReactElement = isLastOption ?
			<React.Fragment>
				<FormControlLabel
					className={classes.formControlLabelWithAddButton}
					control={checkbox}
					label={textField}
				/>
				<IconButton
					onClick={() => {
						onCustomCheckedChange( index, true );
						onAddNewCustomSymbol( '', false );
					}}
					disabled={customSelectOptionList[ customSelectOptionList.length - 1 ].symbol === ''}
				>
					<AddIcon />
				</IconButton>
			</React.Fragment> :
			<FormControlLabel
				control={checkbox}
				label={textField}
			/>;

		return (
			<Grid item key={'custom' + index} xs={6} sm={4} md={3} lg={2}>
				<Box justifyContent='space-between' width='100%' display='inline-flex'>
					{elements}
				</Box>
			</Grid>
		)
	} );

	return <Grid container>
		{originalCheckboxes}
		{customCheckboxes}
	</Grid>;
}

const SelectsTable: FC<SelectTableProps> = ( props: SelectTableProps ) => {
	const { reelAmount, symbolAmount, availableSymbolList, reelIndexes, onChange } = props;

	const tableElements: Array<ReactElement> = [];
	for ( let symbolIndex = 0; symbolIndex < symbolAmount; symbolIndex++ ) {
		const rowElements: Array<ReactElement> = [];
		for ( let reelIndex = 0; reelIndex < reelAmount; reelIndex++ ) {
			const options: Array<ReactElement> = [];
			availableSymbolList.forEach( ( symbol, index ) => {
				options.push(
					<MenuItem key={index} value={symbol}>{symbol}</MenuItem>
				);
			} )
			const handleSelectChange = ( position: IVector2 ) => ( event: React.ChangeEvent<{
				name?: string | undefined;
				value: unknown;
			}> ) => {
				const symbol: string = event.target.value as string;
				onChange( position, symbol );
			};
			rowElements.push(
				<Grid item xs key={reelIndex}>
					<FormControl style={{ width: '100%' }}>
						<Select
							value={reelIndexes[ reelIndex ][ symbolIndex ]}
							onChange={handleSelectChange( { x: reelIndex, y: symbolIndex } )}
						>
							{options}
						</Select>
					</FormControl>
				</Grid>
			);
		}
		const row: ReactElement =
			<Grid container spacing={2} item xs={12} key={symbolIndex}>
				{rowElements}
			</Grid>;
		tableElements.push( row );
	}
	return (
		<Grid container spacing={2}>
			{tableElements}
		</Grid>
	);
}

const Result: FC<ResultProps> = ( props: ResultProps ) => {
	const { reelIndexes } = props;

	let code = 'rngTool.setRngSpinData([\n[\n';
	for ( let reelIndex = 0; reelIndex < reelIndexes.length; reelIndex++ ) {
		let reelText = '[ ';
		for ( let symbolIndex = 0; symbolIndex < reelIndexes[ reelIndex ].length; symbolIndex++ ) {
			const symbol = reelIndexes[ reelIndex ][ symbolIndex ];
			reelText = reelText.concat( '"' + symbol + '"' );
			if ( symbolIndex !== reelIndexes[ reelIndex ].length - 1 ) {
				reelText = reelText.concat( ', ' );
			}
		}
		reelText = reelText.concat( ' ]' );
		if ( reelIndex !== reelIndexes.length - 1 ) {
			reelText = reelText.concat( ',\n' );
		}
		code = code.concat( reelText );
	}
	code = code.concat( '\n]\n]);' );
	return (
		<React.Fragment>
			<TextField
				fullWidth
				multiline
				rows={15}
				inputProps={{ readOnly: true }}
				label='Convert result'
				id='rngToolResult'
				value={code}
			/>
			<CopyButton
				buttonProps={{
					fullWidth: true,
					size: 'large',
					color: 'primary',
					variant: 'contained'
				}}
				targetElementId='rngToolResult'
			>
				Copy result
			</CopyButton>
		</React.Fragment >
	);
}