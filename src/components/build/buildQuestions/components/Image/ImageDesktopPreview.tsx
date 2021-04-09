import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';

import './ImageDesktopPreview.scss'
import { ImageAlign } from './model';


interface Props {
  src: any;
  file: File | null;
  align: ImageAlign;
  height: number;
}

const ImageDesktopPreview: React.FC<Props> = props => {
  let [value, setValue] = React.useState('' as any);

  const toBase64 = (file:Blob) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setValue(reader.result);
    reader.onerror = error => reject(error);
  });

  useEffect(() => {
    if (props.file) {
      toBase64(props.file);
    }
  }, [props.file]);

  if (!props.src && !value) {
    return <div></div>;
  }

  let finalSrc = value ? value : props.src;

  let className = 'preview-image-container';
  if (props.align === ImageAlign.center) {
    className += ' image-center';
  }

  return (
    <div className="image-desktop-preview">
      <div className="image-desktop-preview-container">
        <div className={className}>
          <img
            alt="file" src={finalSrc}
            style={{height: (props.height ? props.height / 4 : 5) + 'vh'}}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageDesktopPreview
