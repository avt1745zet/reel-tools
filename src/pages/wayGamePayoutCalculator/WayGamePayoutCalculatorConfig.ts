import { SymbolType } from '../../core/BasicDataInterfaces';
import { ISymbolOptionData } from './components/availableSymbolSelector/WayGamePayoutAvailableSymbolSelector';

export interface IWayGamePayoutCalculatorConfig {
	defaultReelAmount: number;
	defaultSymbolAmount: number;
	defaultBet: number;
	defaultSelectIndex: number;
	defaultSelectOptionList: Array<ISymbolOptionData>;
	defaultCustomOptionList: Array<ISymbolOptionData>;
}

const WayGamePayoutCalculatorConfig: IWayGamePayoutCalculatorConfig = {
	defaultReelAmount: 5,
	defaultSymbolAmount: 4,

	defaultBet: 1.0,

	defaultSelectIndex: 0,
	defaultSelectOptionList: [
		{
			symbol: 'PIC1',
			checked: true,
			payoutData: {
				atleastKind: 2,
				kindMultiplierMap: new Map( [
					[ 2, 0.2 ],
					[ 3, 2 ],
					[ 4, 8 ],
					[ 5, 20 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'PIC2',
			checked: true,
			payoutData: {
				atleastKind: 2,
				kindMultiplierMap: new Map( [
					[ 2, 0.12 ],
					[ 3, 1.2 ],
					[ 4, 4 ],
					[ 5, 12 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'PIC3',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.8 ],
					[ 4, 3 ],
					[ 5, 8 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'PIC4',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.8 ],
					[ 4, 2 ],
					[ 5, 6 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'PIC5',
			checked: false,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.4 ],
					[ 4, 2 ],
					[ 5, 6 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'PIC6',
			checked: false,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.2 ],
					[ 4, 1.2 ],
					[ 5, 5 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'A',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.2 ],
					[ 4, 1.2 ],
					[ 5, 5 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'K',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.2 ],
					[ 4, 1.2 ],
					[ 5, 5 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'Q',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.2 ],
					[ 4, 0.8 ],
					[ 5, 4 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'J',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.2 ],
					[ 4, 0.8 ],
					[ 5, 4 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'T',
			checked: false,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.1 ],
					[ 4, 0.4 ],
					[ 5, 2 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'N',
			checked: false,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.1 ],
					[ 4, 0.4 ],
					[ 5, 2 ]
				] ),
				symbolType: SymbolType.NORMAL
			}
		},
		{
			symbol: 'WILD',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.8 ],
					[ 4, 3 ],
					[ 5, 8 ]
				] ),
				symbolType: SymbolType.WILD
			}
		},
		{
			symbol: 'SCATTER',
			checked: true,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [
					[ 3, 0.1 ],
					[ 4, 0.4 ],
					[ 5, 2 ]
				] ),
				symbolType: SymbolType.SCATTER
			}
		}
	],
	defaultCustomOptionList: [
		{
			symbol: '',
			checked: false,
			payoutData: {
				atleastKind: 3,
				kindMultiplierMap: new Map( [] ),
				symbolType: SymbolType.NORMAL
			}
		}
	]
}

export default WayGamePayoutCalculatorConfig;