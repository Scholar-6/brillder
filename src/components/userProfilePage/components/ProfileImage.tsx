import React from "react";
// @ts-ignore
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dialog from "@material-ui/core/Dialog";
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

import { uploadFile } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { UserProfile, UserStatus } from "model/user";

interface ProfileImageProps {
  user: UserProfile;
  setImage(profileImage: string): void;
  deleteImage(): void;
  suspendIntroJs(): void;
  resumeIntroJs(): void;
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
  const { profileImage, status } = props.user;

  const handleClick = () => {
    if (profileImage) {
      setDeleteDialog(true);
    } else {
      props.deleteImage();
      openUploadDialog();
    }
    props.suspendIntroJs();
  }

  const openUploadDialog = () => {
    setDeleteDialog(false);
    setUploadDialog(true);
  }

  const openAnotherUploadDialog = () => {
    props.deleteImage();
    setState({ ...state, src: null, result: null});
    openUploadDialog();
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
    props.resumeIntroJs();
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
        props.resumeIntroJs();
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
    return <SpriteIcon name="user" className="active text-dark-gray" />;
  };

  let className = "add-image-button"
  if (profileImage) {
    className += " remove-image"
  }

  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">
        {renderImage()}
        <div className={"svgOnHover " + className} onClick={handleClick}>
          <SpriteIcon name="plus" className="svg-plus active text-white" />
        </div>
      </div>
      <div className="status-container svgOnHover">
        <SpriteIcon name="circle-filled" className={`active ${status === UserStatus.Active ? 'text-theme-green' : 'text-theme-orange'}`} />
        <span>{status === UserStatus.Active ? 'Active' : 'Inactive'}</span>
      </div>
      <Dialog
        open={isUploadOpen}
        onClose={() => {
          setUploadDialog(false);
          props.resumeIntroJs();
        }}
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
        onClose={() => {
          setDeleteDialog(false);
          props.resumeIntroJs();
        }}
        className="dialog-box"
      >
        <div className="dialog-header">
          Doesn't quite capture you?
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button" onClick={openAnotherUploadDialog}>
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
