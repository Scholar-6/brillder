import React from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';

import './DropImage.scss';

interface ImageProps {
  initFileName: string;
  locked: boolean;
  file: File;
  setFile(file: File): void;
}

const DropImage: React.FC<ImageProps> = props => {
  const [base64, setBase64] = React.useState(null as any);
  const [crop, setCrop] = React.useState({ } as ReactCrop.Crop);
  const [image, setImage] = React.useState(null as any);

  const toBase64 = (file:Blob) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  toBase64(props.file).then(b64 => {
    setBase64(b64);
  });

  const getCroppedImg = (crop: any) => {
    if (image) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob:any) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        } else {
          blob.name = 'newFile.jpeg';
          props.setFile(blob);
        }
        resolve(blob);
      }, 'image/jpeg');
    });
    }
  }

  const onImageLoaded = (image: any) => {
    setImage(image);
  }

  if (base64) {
    return (
      <div className="cropping">
        <ReactCrop
          src={base64} crop={crop}
          onChange={setCrop}
          onImageLoaded={onImageLoaded}
          onComplete={getCroppedImg}
        />
      </div>
    );
  }
  return <div></div>
}

export default DropImage;
