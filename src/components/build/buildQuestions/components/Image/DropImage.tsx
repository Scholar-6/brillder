import React, { useEffect } from "react";
import {useDropzone} from 'react-dropzone';

import './DropImage.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ImageProps {
  initFileName: string;
  locked: boolean;
  setFile(file: File): void;
}

const DropImage: React.FC<ImageProps> = props => {
  const [base64, setBase64] = React.useState(null as any);

  const toBase64 = (file:Blob) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: props.locked,
    onDrop: async (files:File[]) => {
      const file = files[0];
      let res = await toBase64(file);
      if (res) {
        setBase64(res)
        props.setFile(file);
      }
    }
  });

  useEffect(() => {
    //setFileName(props.data.value);
  }, [props]);


  return (
    <div className="d" {...getRootProps({className: 'dropzone image-dropzone' + ((props.locked) ? 'disabled' : '')})}>
      <input {...getInputProps()} />
      { base64
        ? <img src={base64} />
        : <SpriteIcon name="image" />
      }
    </div>
  );
}

export default DropImage;
