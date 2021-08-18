export interface IWayGamePayoutCalculatorConfig {
	defaultSymbolPayoutInputText: string;
	defaultReelAmount: number;
	defaultSymbolAmount: number;
	defaultBet: number;
	defaultSelectIndex: number;
}

const WayGamePayoutCalculatorConfig: IWayGamePayoutCalculatorConfig = {
	defaultSymbolPayoutInputText: '',
	defaultReelAmount: 5,
	defaultSymbolAmount: 4,
	defaultBet: 1.0,
	defaultSelectIndex: 0,
}

export default WayGamePayoutCalculatorConfig;