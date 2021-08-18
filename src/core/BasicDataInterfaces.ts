export interface IVector2 {
	x: number;
	y: number;
}

export interface ISymbolPayoutData {
	atleastKind: number;
	kindMultiplierMap: Map<number, number>;
	symbolType: SymbolType;
}

export enum SymbolType {
	NORMAL,
	WILD,
	SCATTER
}

export interface IWinLineData {
	lineConfig: Array<Array<number>>;
	kinds: number;
	symbol: string;
	prize: number;
}