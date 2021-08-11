import React, { FC, ReactElement, useState } from 'react';
import { Checkbox, FormControlLabel, IconButton, Box, createStyles, Grid, makeStyles, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CopyButton } from '../../components/buttons/CopyButton';
import SlotSettingList from '../../components/slotSettingList/SlotSettingList';
import { default as Config, IRNGToolCodeGeneratorConfig } from './RNGToolCodeGeneratorConfig';

interface AvailableSymbolSelectorPanelProps {
	originalSelectOptionList: Array<ISelectStatu>;
	customSelectOptionList: Array<ISelectStatu>;
	onOriginalCheckedChange ( index: number, checked: boolean ): void;
	onCustomCheckedChange ( index: number, checked: boolean ): void;
	onCustomSymbolChange ( index: number, newSymbolName: string ): void;
	onAddNewCustomSymbol ( symbolName: string, defaultChecked: boolean ): void;
}

interface ResultProps {
	reelIndexesList: Array<Array<Array<string>>>;
}

export interface ISelectStatu {
	symbol: string;
	checked: boolean;
}

const useStyles = makeStyles( () =>
	createStyles( {
		root: {
			width: '100%'
		},
		formControlLabelWithAddButton: {
			marginRight: '0px'
		},
		slotSetting: {
			marginBlock: '20px',
		},
		slotSettingList: {
			marginBlock: '20px',
		}
	} )
);

const config: IRNGToolCodeGeneratorConfig = Config;

const RNGToolCodeGenerator: FC = () => {
	const classes = useStyles();

	const [ originalSelectOptionList, setOriginalSelectOptionList ] = useState( config.defaultSelectOptionList );
	const [ customSelectOptionList, setCustomSelectOptionList ] = useState( [ { symbol: '', checked: false } ] );

	const [ availableSymbolList, setAvailableSymbolList ] = useState( getCheckedSymbol( config.defaultSelectOptionList ) );

	const defaultReelIndexesList: Array<Array<Array<string>>> = new Array<Array<Array<string>>>( 1 );
	const firstReelIndexes: Array<Array<string>> = new Array<Array<string>>( config.defaultReelAmount );
	for ( let reelIndex = 0; reelIndex < config.defaultReelAmount; reelIndex++ ) {
		firstReelIndexes[ reelIndex ] = new Array<string>( config.defaultSymbolAmount );
		const symbolName = availableSymbolList[ config.defaultSelectIndex ];
		firstReelIndexes[ reelIndex ].fill( symbolName );
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

	const handleSlotSettingListChange = ( newReelIndexesList: Array<Array<Array<string>>> ) => {
		setReelIndexesList( newReelIndexesList );
	}

	const generateReelIndexesListByAvailableSymbolList = ( reelIndexesList: Array<Array<Array<string>>>, selectSymbolList: Array<string> ): Array<Array<Array<string>>> => {
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

	return (
		<Box component='form' className={classes.root}>
			<AvailableSymbolSelectorPanel originalSelectOptionList={originalSelectOptionList} customSelectOptionList={customSelectOptionList}
				onOriginalCheckedChange={handleOriginalAvailableSymbolCheckedChange}
				onCustomCheckedChange={handleCustomAvailableSymbolCheckedChange}
				onCustomSymbolChange={handleCustomAvailableSymbolNameChange}
				onAddNewCustomSymbol={handleAddNewCustomAvailableSymbol}
			/>
			<SlotSettingList
				availableSymbolList={availableSymbolList}
				reelIndexesList={reelIndexesList}
				slotSettingProps={{
					className: classes.slotSetting
				}}
				onChange={handleSlotSettingListChange}
				className={classes.slotSettingList}
			/>
			<Result reelIndexesList={reelIndexesList} />
		</Box>
	);
};

export default RNGToolCodeGenerator;

function getCheckedSymbol ( options: Array<ISelectStatu> ): Array<string> {
	const result: Array<string> = options.filter( option => option.checked === true ).map( option => option.symbol );
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