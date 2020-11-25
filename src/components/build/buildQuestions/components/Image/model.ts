export enum ImageAlign {
  left = 1,
  center
}

export interface ImageComponentData {
  value: string;
  imageSource: string;
  imageCaption: string;
  imageAlign: ImageAlign;
  imageHeight: number;
  imagePermision: boolean;
}
