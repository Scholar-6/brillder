export enum SpecialSymbols {
  LineFeed = 10,
  Space = 32,

  // unselectable symbols
  Comma = 44,
  Dot = 46,
}

export interface Word {
  text: string,
  isPunctuation?: boolean;
  isBreakLine?: boolean,
  notSelectable?: boolean,
  checked: boolean
}

export interface BuildWord extends Word {
}

export interface PlayWord extends Word {
  selected?: boolean;
}

export interface IPlayWordComponent {
  selected: boolean;
  type: number;
  isPoem?: boolean;
  words: PlayWord[];
}