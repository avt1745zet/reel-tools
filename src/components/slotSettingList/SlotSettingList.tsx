import React, { FC, ReactElement } from 'react';
import { Box, Fab, Tooltip } from '@material-ui/core';
import { CommonProps, OverridableTypeMap } from '@material-ui/core/OverridableComponent';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SlotSetting from '../slotSetting/SlotSetting';

interface SlotSettingListProps extends CommonProps<OverridableTypeMap> {
	availableSymbolList: Array<string>;
	reelIndexesList: Array<Array<Array<string>>>;
	slotSettingProps?: CommonProps<OverridableTypeMap>;
	onChange ( reelIndexesList: Array<Array<Array<string>>> ): void;
}

const SlotSettingList: FC<SlotSettingListProps> = ( props: SlotSettingListProps ) => {
	const { availableSymbolList, reelIndexesList, slotSettingProps, onChange, ...other } = props;

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
		<SlotSetting
			key={index}
			title={'Spin result ' + ( index + 1 )}
			availableSymbolList={availableSymbolList}
			reelIndexes={reelIndexes}
			onChange={handleSlotSettingChange( index )}
			className={slotSettingProps ? slotSettingProps.className : undefined}
		/>
	);

	const addButton: ReactElement = (
		<Box display='inline-block' marginX={2}>
			<Tooltip title='Add Spin Result'>
				<Fab color='primary' onClick={handleAddButtonClick}>
					<AddIcon />
				</Fab>
			</Tooltip>
		</Box>
	);

	const removeButton: ReactElement = (
		<Box display='inline-block' marginX={2}>
			<Tooltip title='Delete Last Spin Result'>
				<Fab color='secondary' onClick={handleRemoveButtonClick}>
					<RemoveIcon />
				</Fab>
			</Tooltip>
		</Box>
	);

	const getRemoveButton = ( reelIndexesList: Array<Array<Array<string>>> ) => {
		return reelIndexesList.length > 1 ? removeButton : undefined;
	}

	const buttons: ReactElement = (
		<Box textAlign='center'>
			{addButton}
			{getRemoveButton( reelIndexesList )}
		</Box>
	);

	return (
		<Box {...other}>
			{slotSettingElements}
			{buttons}
		</Box>
	);
}

export default SlotSettingList;