import React from "react";
import { useDropzone } from "react-dropzone";
import { AudioStatus } from "./Sound";

interface DropzoneProps {
  locked: boolean;
  status: AudioStatus;
  saveAudio(file: any): void;
}


const Dropzone: React.FC<DropzoneProps> = ({ locked, ...props }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    disabled: locked,
    onDrop: (files: any[]) => {
      if (files && files.length > 0) {
        props.saveAudio(files[0]);
      }
    },
  });

  if (props.status === AudioStatus.Start) {
    const files = acceptedFiles.map((file: any) => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));

    return (
      <div>
        <div {...getRootProps({className: "dropzone " + (locked ? "disabled" : "")})}>
          <input {...getInputProps()} />
          <p>Drag Sound File Here | Click to Select Sound File</p>
        </div>
        {files[0] ? files[0] : ""}
      </div>
    );
  }
  return <div></div>;
};

export default Dropzone;
