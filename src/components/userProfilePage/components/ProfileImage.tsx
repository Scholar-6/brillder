import React, { useState } from "react";
// @ts-ignore
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dialog from "@material-ui/core/Dialog";
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import Checkbox from "@material-ui/core/Checkbox";

import { uploadFile } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User, UserProfile } from "model/user";

interface ProfileImageProps {
  user: UserProfile;
  currentUser: User;
  subscriptionState?: number;
  setImage(profileImage: string, imagePublic: boolean): void;
  deleteImage(): void;
  suspendIntroJs(): void;
  resumeIntroJs(): void;
}

const ProfileImage: React.FC<ProfileImageProps> = (props) => {
  const [imagePublic, setPublic] = useState(false);
  const [state, setState] = useState({
    result: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  })
  const [isUploadOpen, setUploadDialog] = useState(false);
  const [isDeleteOpen, setDeleteDialog] = useState(false);
  const { profileImage } = props.user;

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
    setState({ ...state, src: null, result: null });
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
        props.setImage(fileName, imagePublic);
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

  const renderSubscribeIcon = () => {
    if (props.subscriptionState && props.subscriptionState > 1) {
      return <SpriteIcon name="hero-sparkle" />
    }
    return '';
  }

  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">
        {renderImage()}
        <div className={"svgOnHover " + className} onClick={handleClick}>
          <SpriteIcon name="plus" className="svg-plus active text-white" />
        </div>
      </div>
      <div className="profile-header">
        <div className="profile-username-v2">{props.user.username ? props.user.username : "USERNAME"}</div>
        {renderSubscribeIcon()}
      </div>
      <Dialog
        open={isUploadOpen}
        onClose={() => {
          setUploadDialog(false);
          props.resumeIntroJs();
        }}
        className="dialog-box image-dialog-v56"
      >
        <div className="dialog-header">
          <DropNCrop onChange={(value: any) => setState(value)} value={state} />
        </div>
        <div className="dialog-header checkbox-container">
          <div className="flex-center light" onClick={() => setPublic(!imagePublic)}>
            <div className="flex-center">
              <SpriteIcon name="globe" className="fgr-icon" />
              <Checkbox checked={imagePublic === true} />
            </div>
            <span>
              <span className="bold">Educators will never be able to view Learner profile pictures without their consent.</span><br />
              When a Builder invites an editor to peer review their work, or an Educator wants to share a class with a colleague, pictures can help them choose the right user and make interactions feel more personal.
              Check the box to consent to your picture being visible to fellow Educators.
            </span>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-green yes-button flex-center" onClick={uploadCropedFile}>
            <span>Upload</span>
            <SpriteIcon name="feather-cloud-upload" />
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
