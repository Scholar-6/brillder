import React from 'react'
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
 
import './Image.scss'
import { Grid } from '@material-ui/core';

interface ImageProps {
  locked: boolean,
  index: number,
  data: any,
  updateComponent(component:any, index:number): void
}

const ImageComponent: React.FC<ImageProps> = ({locked, ...props}) => {
  const [fileName, setFileName] = React.useState(props.data.value);
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    disabled: locked,
    onDrop: (files:any[]) => {
      var formData = new FormData();
      const file = Object.assign(files[0]);
      formData.append('file', file);
      return axios.post(
        process.env.REACT_APP_BACKEND_HOST + '/fileUpload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      ).then(res => {
        console.log(res.data.fileName);
        let comp = Object.assign({}, props.data);
        comp.value = res.data.fileName;
        props.updateComponent(comp, props.index);
        setFileName(comp.value);
      })
      .catch(error => {
      });
    }
  });

  
  const files = acceptedFiles.map((file:any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="image-drag-n-drop">
      <div {...getRootProps({className: 'dropzone ' + ((locked) ? 'disabled' : '')})}>
        <input {...getInputProps()} />
        {
          fileName
            ? <img style={{width: '100%'}} src={`${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`} />
            : <Grid
          container
          justify="center"
          alignContent="center"
          style={{
            height:'100%',
            backgroundPosition: 'center'
          }}
        >
          <p>Drag Image Here | Click to Select Image</p>
        </Grid>
        }
      </div>
    </div>
  );
}


export default ImageComponent
