export enum SpecialSymbols {
  LineFeed = 10,
  Space = 32,
}

export interface Word {
  text: string,
  isBreakLine?: boolean,
  notSelectable?: boolean,
  checked: boolean
}

export interface BuildWord extends Word {
}

export interface PlayWord extends Word {
  selected?: boolean
}

export interface IPlayWordComponent {
  selected: boolean
  type: number
  words: PlayWord[]
}