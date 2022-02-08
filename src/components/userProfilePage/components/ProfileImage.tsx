import React, { useState } from "react";
// @ts-ignore
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dialog from "@material-ui/core/Dialog";
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import Checkbox from "@material-ui/core/Checkbox";
import { useHistory } from "react-router-dom";

import { uploadFile } from "components/services/uploadFile";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User, UserProfile, UserStatus } from "model/user";
import map from "components/map";

interface ProfileImageProps {
  user: UserProfile;
  currentUser: User;
  setImage(profileImage: string, imagePublic: boolean): void;
  deleteImage(): void;
  suspendIntroJs(): void;
  resumeIntroJs(): void;
}

const ProfileImage: React.FC<ProfileImageProps> = (props) => {
  const history = useHistory();
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

  const renderStatus = () => {
    if (status === UserStatus.Active) {
      console.log(props.currentUser)
      if (props.currentUser.subscriptionState && props.currentUser.subscriptionState > 0) {
        return (
          <div className="status-container active-status-container svgOnHover">
            <SpriteIcon name="circle-filled" className="active text-theme-green" />
            <span><div className="flex-center premium-container">{props.currentUser.subscriptionState === 2 ? 'Premium Learner' : props.currentUser.subscriptionState === 3 ? 'Premium Educator' : ''}</div></span>
          </div>
        );
      }
      return (
        <div className="status-container active-status-container svgOnHover">
          <SpriteIcon name="circle-filled" className="active text-theme-green" />
          <span><div className="flex-center premium-container">Free Trial <div className="btn-premium" onClick={() => history.push(map.ChoosePlan)}>Go Premium <SpriteIcon name="hero-sparkle" /></div></div></span>
        </div>
      );
    }
    return (
      <div className="status-container svgOnHover">
        <SpriteIcon name="circle-filled" className="active text-theme-orange" />
        <span>Inactive</span>
      </div>
    );
  }

  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">
        {renderImage()}
        <div className={"svgOnHover " + className} onClick={handleClick}>
          <SpriteIcon name="plus" className="svg-plus active text-white" />
        </div>
      </div>
      {renderStatus()}
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
        <div className="dialog-header">
          <div className="flex-center" onClick={() => setPublic(!imagePublic)}>
            <div className="flex-center">
              <SpriteIcon name="globe" className="fgr-icon" />
              <Checkbox checked={imagePublic === true} />
            </div>
            Allow to show image during search and invitations.
          </div>
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
