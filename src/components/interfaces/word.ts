export interface Word {
  text: string,
  isBreakLine?: boolean,
  notSelectable?: boolean,
  checked: boolean
}

export interface PlayWord extends Word {
  selected?: boolean
}

export interface IPlayWordComponent {
  selected: boolean
  type: number
  words: PlayWord[]
}