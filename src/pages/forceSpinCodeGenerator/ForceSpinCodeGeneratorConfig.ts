import { ISelectStatu } from './ForceSpinCodeGenerator';

export interface IForceSpinCodeGeneratorConfig {
	defaultReelAmount: number;
	defaultSymbolAmount: number;
	defaultSelectIndex: number;
	defaultSelectOptionList: Array<ISelectStatu>;
}

const forceSpinCodeGeneratorConfig: IForceSpinCodeGeneratorConfig = {
	defaultReelAmount: 5,
	defaultSymbolAmount: 4,

	defaultSelectIndex: 0,
	defaultSelectOptionList: [
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
}

export default forceSpinCodeGeneratorConfig;