import React from "react";
// @ts-ignore
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dialog from "@material-ui/core/Dialog";
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

import sprite from "assets/img/icons-sprite.svg";
import { uploadFile } from "components/services/uploadFile";

interface ProfileImageProps {
  profileImage: string;
  setImage(profileImage: string): void;
  deleteImage(): void;
}

const ProfileImage: React.FC<ProfileImageProps> = (props) => {
  const [state, setState] = React.useState({
    result: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  })
  const [isUploadOpen, setUploadDialog] = React.useState(false);
  const [isDeleteOpen, setDeleteDialog] = React.useState(false);
  const { profileImage } = props;

  const handleClick = () => {
    if (profileImage) {
      setDeleteDialog(true);
    } else {
      props.deleteImage();
      openUploadDialog();
    }
  }

  const openUploadDialog = () => {
    setDeleteDialog(false);
    setUploadDialog(true);
  }

  const dataURLtoFile = (dataurl: string, filename: string) => {
    try {
      var arr = dataurl.split(',') as any;

      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch {
      return null;
    }
  }

  const removeImage = () => {
    setDeleteDialog(false);
    props.deleteImage();
  }

  const uploadCropedFile = () => {
    let file = dataURLtoFile(state.result as any, state.filename as any);
    if (!file) { return; } 
    uploadFile(
      file as File,
      (res: any) => {
        const fileName = res.data.fileName;
        props.setImage(fileName);
        setUploadDialog(false);
      },
      () => { }
    );
  }

  const renderImage = () => {
    if (profileImage) {
      return (
        <img
          src={`${process.env.REACT_APP_BACKEND_HOST}/files/${profileImage}`}
          className="real-profile-image" alt=""
        />
      );
    }
    return (
      <svg className="svg active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#user"} className="text-dark-gray" />
      </svg>
    );
  };

  let className = "add-image-button"
  if (props.profileImage) {
    className += " remove-image"
  }

  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">
        {renderImage()}
        <div className={"svgOnHover " + className} onClick={handleClick}>
          <svg className="svg svg-plus active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#plus"} className="text-white" />
          </svg>
        </div>
      </div>
      <div className="status-container svgOnHover">
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#circle-filled"} className="text-theme-green" />
        </svg>
        <span>Active</span>
      </div>
      <Dialog
        open={isUploadOpen}
        onClose={() => setUploadDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box"
      >
        <div className="dialog-header">
          <DropNCrop onChange={(value: any) => setState(value)} value={state} />
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button" onClick={uploadCropedFile}>
            <span>Upload</span>
          </button>
        </div>
      </Dialog>
      <Dialog
        open={isDeleteOpen}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box"
      >
        <div className="dialog-header">
          Doesn't quite capture you?
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button" onClick={openUploadDialog}>
            <span>Add another</span>
          </button>
          <button className="btn btn-md bg-gray no-button" onClick={removeImage}>
            <span>No, remove</span>
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileImage;
