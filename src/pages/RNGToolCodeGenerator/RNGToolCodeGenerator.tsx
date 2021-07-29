import React, { FC, ReactElement, useState } from 'react';
import { Checkbox, Divider, FormControl, FormControlLabel, IconButton, MenuItem, Select, Box, createStyles, Grid, makeStyles, TextField, Tooltip, Fab, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { CopyButton } from '../../components/buttons/CopyButton';

interface AvailableSymbolSelectorPanelProps {
	originalSelectOptionList: Array<ISelectStatu>;
	customSelectOptionList: Array<ISelectStatu>;
	onOriginalCheckedChange ( index: number, checked: boolean ): void;
	onCustomCheckedChange ( index: number, checked: boolean ): void;
	onCustomSymbolChange ( index: number, newSymbolName: string ): void;
	onAddNewCustomSymbol ( symbolName: string, defaultChecked: boolean ): void;
}

interface SlotSettingListProps {
	availableSymbolList: Array<string>;
	reelIndexesList: Array<Array<Array<string>>>;
	onChange ( reelIndexesList: Array<Array<Array<string>>> ): void;
}

interface SlotSettingProps {
	availableSymbolList: Array<string>;
	index: number;
	reelIndexes: Array<Array<string>>;
	onChange ( newReelIndexes: Array<Array<string>> ): void;
}

interface SelectTableProps {
	reelAmount: number;
	symbolAmount: number;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange ( posiiton: IVector2, value: string ): void;
}

interface ResultProps {
	reelIndexesList: Array<Array<Array<string>>>;
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

const RNGToolCodeGenerator: FC = () => {
	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( [ { symbol: '', checked: false } ] );

	const defaultAvailableSymbolList: Array<string> = new Array<string>();
	defaultSelectOptionList.forEach( selectOption => {
		if ( selectOption.checked ) {
			defaultAvailableSymbolList.push( selectOption.symbol );
		}
	} );
	const [ availableSymbolList, setAvailableSymbolList ] = useState( getCheckedSymbol( defaultSelectOptionList ) );

	const defaultReelIndexesList: Array<Array<Array<string>>> = new Array<Array<Array<string>>>( 1 );
	const firstReelIndexes: Array<Array<string>> = new Array<Array<string>>( defaultReelAmount );
	for ( let reelIndex = 0; reelIndex < defaultReelAmount; reelIndex++ ) {
		firstReelIndexes[ reelIndex ] = new Array<string>( defaultSymbolAmount );
		for ( let symbolIndex = 0; symbolIndex < defaultSymbolAmount; symbolIndex++ ) {
			const symbolName = availableSymbolList[ defaultSelectIndex ];
			firstReelIndexes[ reelIndex ][ symbolIndex ] = symbolName;
		}
	}
	defaultReelIndexesList[ 0 ] = firstReelIndexes;

	const [ reelIndexesList, setReelIndexesList ] = useState( defaultReelIndexesList );

	const handleOriginalAvailableSymbolCheckedChange = ( index: number, checked: boolean ) => {
		const newOriginalSelectOptionList: Array<ISelectStatu> = originalSelectOptionList.slice();
		newOriginalSelectOptionList[ index ].checked = checked;
		setOriginalSelectOptionList( newOriginalSelectOptionList );

		const newSelectSymbolList = [ ...getCheckedSymbol( newOriginalSelectOptionList ), ...getCheckedSymbol( customSelectOptionList ) ];
		setAvailableSymbolList( newSelectSymbolList );

		const newReelIndexesList: Array<Array<Array<string>>> = generateReelIndexesListByAvailableSymbolList( reelIndexesList, newSelectSymbolList );
		setReelIndexesList( newReelIndexesList );
	}

	const handleCustomAvailableSymbolCheckedChange = ( index: number, checked: boolean ) => {
		const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
		newCustomSelectOptionList[ index ].checked = checked;
		setCustomSelectOptionList( newCustomSelectOptionList );

		const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
		setAvailableSymbolList( newSelectSymbolList )

		const newReelIndexesList: Array<Array<Array<string>>> = generateReelIndexesListByAvailableSymbolList( reelIndexesList, newSelectSymbolList );
		setReelIndexesList( newReelIndexesList );
	}

	const handleCustomAvailableSymbolNameChange = ( index: number, newSymbolName: string ) => {
		newSymbolName = newSymbolName.toUpperCase();
		const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
		const newChecked = newSymbolName === '' ? false : newCustomSelectOptionList[ index ].checked;
		newCustomSelectOptionList[ index ] = { symbol: newSymbolName, checked: newChecked };
		setCustomSelectOptionList( newCustomSelectOptionList );

		const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
		setAvailableSymbolList( newSelectSymbolList )

		const newReelIndexesList: Array<Array<Array<string>>> = generateReelIndexesListByAvailableSymbolList( reelIndexesList, newSelectSymbolList );
		setReelIndexesList( newReelIndexesList );
	}

	const handleAddNewCustomAvailableSymbol = ( symbolName: string, checked: boolean ) => {
		const newCustomSelectOptionList: Array<ISelectStatu> = customSelectOptionList.slice();
		newCustomSelectOptionList.push( { symbol: symbolName, checked: checked } );
		setCustomSelectOptionList( newCustomSelectOptionList );

		const newSelectSymbolList = [ ...getCheckedSymbol( originalSelectOptionList ), ...getCheckedSymbol( newCustomSelectOptionList ) ];
		setAvailableSymbolList( newSelectSymbolList )
	}

	const generateReelIndexesListByAvailableSymbolList: ( reelIndexesList: Array<Array<Array<string>>>, selectSymbolList: Array<string> ) => Array<Array<Array<string>>> =
		( reelIndexesList: Array<Array<Array<string>>>, selectSymbolList: Array<string> ) => {
			const newReelIndexesList: Array<Array<Array<string>>> = reelIndexesList.slice();
			newReelIndexesList.forEach( reelIndexes => {
				reelIndexes.forEach( ( reel, reelIndex ) => {
					reel.forEach( ( symbol, symbolIndex ) => {
						const isSymbolOutOfRange = !selectSymbolList.includes( symbol );
						if ( isSymbolOutOfRange ) {
							reelIndexes[ reelIndex ][ symbolIndex ] = selectSymbolList[ 0 ];
						}
					} )
				} );
			} );
			return newReelIndexesList;
		}

	const classes = useStyles();

	return (
		<form className={classes.root} >
			<AvailableSymbolSelectorPanel originalSelectOptionList={originalSelectOptionList} customSelectOptionList={customSelectOptionList}
				onOriginalCheckedChange={handleOriginalAvailableSymbolCheckedChange}
				onCustomCheckedChange={handleCustomAvailableSymbolCheckedChange}
				onCustomSymbolChange={handleCustomAvailableSymbolNameChange}
				onAddNewCustomSymbol={handleAddNewCustomAvailableSymbol}
			/>
			<Divider className={classes.divider} />
			<SlotSettingList availableSymbolList={availableSymbolList} reelIndexesList={reelIndexesList} onChange={( newReelIndexesList ) => { setReelIndexesList( newReelIndexesList ) }}></SlotSettingList>
			<Divider className={classes.divider} />
			<Result reelIndexesList={reelIndexesList}></Result>
		</form>
	);
};

export default RNGToolCodeGenerator;

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

const AvailableSymbolSelectorPanel: FC<AvailableSymbolSelectorPanelProps> = ( props: AvailableSymbolSelectorPanelProps ) => {
	const { originalSelectOptionList, customSelectOptionList, onOriginalCheckedChange, onCustomCheckedChange, onCustomSymbolChange, onAddNewCustomSymbol } = props;

	const classes = useStyles();

	const originalCheckboxes: Array<ReactElement> = originalSelectOptionList.map( ( selectOption, index ) => {
		const checked = selectOption.checked;
		const symbol = selectOption.symbol;

		const handleCheckboxChange = ( index: number ) => ( event: React.ChangeEvent<HTMLInputElement>, checked: boolean ) => {
			onOriginalCheckedChange( index, checked );
		};

		return (
			<Grid item key={index} xs={12} sm={6} md={4} lg={2}>
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
			<Grid item key={'custom' + index} xs={12} sm={6} md={4} lg={2}>
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

const SlotSettingList: FC<SlotSettingListProps> = ( props: SlotSettingListProps ) => {
	const { availableSymbolList, reelIndexesList, onChange } = props;

	const handleSlotSettingChange = ( index: number ) => ( reelIndexes: Array<Array<string>> ) => {
		const newReelIndexesList: Array<Array<Array<string>>> = reelIndexesList.slice();
		newReelIndexesList[ index ] = reelIndexes;
		onChange( newReelIndexesList );
	};

	const handleAddButtonClick = () => {
		const newReelIndexesList: Array<Array<Array<string>>> = reelIndexesList.slice();
		const lastReelIndexes: Array<Array<string>> = newReelIndexesList[ newReelIndexesList.length - 1 ];
		const newReelIndexes: Array<Array<string>> = new Array<Array<string>>( lastReelIndexes.length );
		for ( let reelIndex = 0; reelIndex < newReelIndexes.length; reelIndex++ ) {
			const symbols = new Array<string>( lastReelIndexes[ reelIndex ].length );
			for ( let symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++ ) {
				symbols[ symbolIndex ] = availableSymbolList[ 0 ];
			}
			newReelIndexes[ reelIndex ] = symbols;
		}
		newReelIndexesList.push( newReelIndexes );
		onChange( newReelIndexesList );
	};

	const handleRemoveButtonClick = () => {
		const newReelIndexesList: Array<Array<Array<string>>> = reelIndexesList.slice();
		newReelIndexesList.splice( newReelIndexesList.length - 1 );
		onChange( newReelIndexesList );
	};

	const slotSettingElements: Array<ReactElement> = reelIndexesList.map( ( reelIndexes, index ) =>
		<SlotSetting key={index} availableSymbolList={availableSymbolList} index={index} reelIndexes={reelIndexes} onChange={handleSlotSettingChange( index )} />
	);

	const addButton: ReactElement =
		<Box display='inline-block' marginX={2}>
			<Tooltip title='Add Spin Result'>
				<Fab color='primary' onClick={handleAddButtonClick}>
					<AddIcon />
				</Fab>
			</Tooltip>
		</Box>;

	const removeButton: ReactElement =
		<Box display='inline-block' marginX={2}>
			<Tooltip title='Delete last Spin Result'>
				<Fab color='secondary' onClick={handleRemoveButtonClick}>
					<RemoveIcon />
				</Fab>
			</Tooltip>
		</Box>;

	const getRemoveButton = ( reelIndexesList: Array<Array<Array<string>>> ) => {
		return reelIndexesList.length > 1 ? removeButton : undefined;
	}

	const buttons: ReactElement =
		<Box textAlign='center'>
			{addButton}
			{getRemoveButton( reelIndexesList )}
		</Box>;

	return (
		<Box>
			{slotSettingElements}
			{buttons}
		</Box>
	);
}

const SlotSetting: FC<SlotSettingProps> = ( props: SlotSettingProps ) => {
	const { availableSymbolList, index, reelIndexes, onChange } = props;

	const reelAmount = reelIndexes.length;
	const symbolAmount = reelIndexes[ 0 ].length;

	const classes = useStyles();

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const newReelAmount = Number.parseInt( event.target.value );
		if ( isPositiveInteger( newReelAmount ) ) {
			const newReelIndexes: Array<Array<string>> = new Array<Array<string>>( newReelAmount );
			for ( let i = 0; i < newReelIndexes.length; i++ ) {
				newReelIndexes[ i ] = reelIndexes[ i ] ? reelIndexes[ i ] : newReelIndexes[ 0 ].map( () => availableSymbolList[ 0 ] );
			}
			onChange( newReelIndexes );
		}
	}

	const handleRowAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
		const newSymbolAmount = Number.parseInt( event.target.value );
		if ( isPositiveInteger( newSymbolAmount ) ) {
			const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
			newReelIndexes.forEach( ( reel, index ) => {
				const newReel: Array<string> = new Array<string>( newSymbolAmount );
				for ( let i = 0; i < newReel.length; i++ ) {
					newReel[ i ] = reel[ i ] ? reel[ i ] : availableSymbolList[ 0 ];
				}
				newReelIndexes[ index ] = newReel;
			} );
			onChange( newReelIndexes );
		}
	}

	return (
		<Box>
			<Box>
				<Typography color='textPrimary' variant='h5'>
					Spin result {index + 1}
				</Typography>
			</Box>
			<Grid container item spacing={2} xs={12}>
				<Grid item xs={12} md={6}>
					<TextField type='number' value={reelAmount} fullWidth label='Reel amount' onChange={handleReelAmountChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField type='number' value={symbolAmount} fullWidth label='Row amount' onChange={handleRowAmountChange} />
				</Grid>
			</Grid>
			<SelectsTable reelIndexes={reelIndexes} reelAmount={reelAmount} symbolAmount={symbolAmount} availableSymbolList={availableSymbolList} onChange={( position, value ) => {
				const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
				newReelIndexes[ position.x ][ position.y ] = value;
				onChange( newReelIndexes );
			}} />
			<Divider className={classes.divider} />
		</Box>
	);
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
			<Grid container item xs={12} key={symbolIndex}>
				{rowElements}
			</Grid>;
		tableElements.push( row );
	}
	return (
		<Grid container item spacing={2} xs={12}>
			{tableElements}
		</Grid>
	);
}

const Result: FC<ResultProps> = ( props: ResultProps ) => {
	const { reelIndexesList } = props;

	let code = 'rngTool.setRngSpinData([\n';

	reelIndexesList.forEach( ( reelIndexes, index ) => {
		let reelIndexesText = '[\n';
		reelIndexes.forEach( ( reel, reelIndex ) => {
			let reelText = '[ ';
			reel.forEach( ( symbol, symbolIndex ) => {
				reelText = reelText.concat( '"' + symbol + '"' );
				if ( symbolIndex !== reelIndexes[ reelIndex ].length - 1 ) {
					reelText = reelText.concat( ', ' );
				}
			} );
			reelText = reelText.concat( ' ]' );
			if ( reelIndex !== reelIndexes.length - 1 ) {
				reelText = reelText.concat( ',\n' );
			}
			reelIndexesText = reelIndexesText.concat( reelText );
		} );
		reelIndexesText = reelIndexesText.concat( '\n]' );
		if ( index !== reelIndexesList.length - 1 ) {
			reelIndexesText = reelIndexesText.concat( ',\n' );
		}
		code = code.concat( reelIndexesText );
	} );

	code = code.concat( '\n]);' );

	return (
		<React.Fragment>
			<TextField
				fullWidth
				multiline
				rows={15}
				inputProps={{ readOnly: true }}
				variant='filled'
				label='Output result'
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