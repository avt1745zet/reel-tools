import React, { FC, ReactElement } from 'react';
import { Box, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { CommonProps, OverridableTypeMap } from '@material-ui/core/OverridableComponent';
import { IVector2 } from '../../core/BasicDataInterfaces';

export interface SlotSettingProps extends CommonProps<OverridableTypeMap> {
	title?: string;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange?( newReelIndexes: Array<Array<string>> ): void;
}

interface SelectTableProps {
	reelAmount: number;
	symbolAmount: number;
	availableSymbolList: Array<string>;
	reelIndexes: Array<Array<string>>;
	onChange?( posiiton: IVector2, value: string ): void;
}

const SlotSetting: FC<SlotSettingProps> = ( props: SlotSettingProps ) => {
	const { title, availableSymbolList, reelIndexes, onChange, ...other } = props;

	const reelAmount: number = reelIndexes.length;
	const symbolAmount: number = reelIndexes[ 0 ].length;

	const handleReelAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ): void => {
		if ( onChange ) {
			const newReelAmount: number = Number.parseInt( event.target.value );

			const newReelIndexes: Array<Array<string>> = new Array<Array<string>>( newReelAmount );
			for ( let i = 0; i < newReelIndexes.length; i++ ) {
				newReelIndexes[ i ] = reelIndexes[ i ] ? reelIndexes[ i ] : newReelIndexes[ 0 ].map( () => availableSymbolList[ 0 ] );
			}
			onChange( newReelIndexes );
		}
	}

	const handleRowAmountChange = ( event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ): void => {
		if ( onChange ) {
			const newSymbolAmount: number = Number.parseInt( event.target.value );

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

	const handleSelectsTableChange = ( position: IVector2, value: string ): void => {
		if ( onChange ) {
			const newReelIndexes: Array<Array<string>> = reelIndexes.slice();
			newReelIndexes[ position.x ][ position.y ] = value;
			onChange( newReelIndexes );
		}
	}

	const titleElement: ReactElement =
		<Box>
			<Typography color='textPrimary' variant='h5'>
				{title}
			</Typography>
		</Box>;

	const getTitleElement = ( value: string | undefined ) => {
		return value ? titleElement : undefined;
	}

	return (
		<Box {...other}>
			{getTitleElement( title )}
			<Grid container item spacing={2} xs={12}>
				<Grid item xs={12} md={6}>
					<TextField
						type='number'
						label='Reel amount'
						fullWidth
						inputProps={{
							min: 1
						}}
						value={reelAmount}
						onChange={handleReelAmountChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						type='number'
						label='Row amount'
						fullWidth
						inputProps={{
							min: 1
						}}
						value={symbolAmount}
						onChange={handleRowAmountChange}
					/>
				</Grid>
			</Grid>
			<SelectsTable
				reelIndexes={reelIndexes}
				reelAmount={reelAmount}
				symbolAmount={symbolAmount}
				availableSymbolList={availableSymbolList}
				onChange={handleSelectsTableChange}
			/>
		</Box>
	);
}

export default SlotSetting;

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
			} );
			const handleSelectChange = ( position: IVector2 ) => ( event: React.ChangeEvent<{ name?: string; value: unknown }> ): void => {
				if ( onChange ) {
					const symbol: string = event.target.value as string;
					onChange( position, symbol );
				}
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