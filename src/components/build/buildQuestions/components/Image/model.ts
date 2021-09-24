export enum ImageAlign {
  left = 1,
  center
}

export interface MainImageProps {
  imageSource?: string;
  imageCaption?: string;
  imagePermision?: boolean;
}

export interface ImageComponentData extends MainImageProps {
  value: string;
  url: string;
  imageAlign: ImageAlign;
  imageHeight: number;
}
