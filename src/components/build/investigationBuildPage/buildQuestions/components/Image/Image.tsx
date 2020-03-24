import React from 'react'
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
// @ts-ignore 
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

import './Image.scss'
import { Button } from '@material-ui/core';

interface ImageProps {
  locked: boolean,
  index: number,
  data: any,
  updateComponent(component:any, index:number): void
}


const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [result, setResult] = React.useState('');
  const [cropImage, setCropImage] = React.useState({
    result: null,
    filename: null,
    filetype: null,
    withCredentials: true,
    src: null,
    error: null,
  });
  const [fileName, setFileName] = React.useState(props.data.value);

  const toDataURL = (url: string, callback: any) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  if (props.data.value) {
    const src = `${process.env.REACT_APP_BACKEND_HOST}/files/${props.data.value}`;
    toDataURL(src, (base64: any) => {
      setCropImage({
        result: null,
        filename: null,
        filetype: null,
        withCredentials: true,
        src: base64,
        error: null,
      });
    });
  }

  const saveImage = () => {
    console.log(result)
    if (result) {
      let file = dataURItoBlob(result as any);
      var formData = new FormData();
      formData.append('file', file);
      return axios.post(
        process.env.REACT_APP_BACKEND_HOST + '/fileUpload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      ).then(res => {
        let comp = Object.assign({}, props.data);
        comp.value = res.data.fileName;
        props.updateComponent(comp, props.index);
        setFileName(comp.value);
      })
      .catch(error => {
        alert('Can`t save image');
      });
    }
  }

  const onCropChange = (crop:any) => {
    setCropImage(crop);
    setResult(crop.result);
  };

  function dataURItoBlob(dataURI: string) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  return (
    <div>
      <DropNCrop style={{height: '20vh !important'}} value={cropImage} onChange={onCropChange} />
      <Button className="save-image-button" onClick={saveImage}>Save Image</Button>
    </div>
  );
}


export default ImageComponent
