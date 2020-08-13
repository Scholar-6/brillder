import React from "react";
// @ts-ignore
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dialog from "@material-ui/core/Dialog";
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';


import sprite from "assets/img/icons-sprite.svg";
import { uploadFile } from "components/services/uploadFile";

interface ProfileImageProps {
  imageUploadSuccess: boolean;
  profileImage: string;
  setImage(profileImage: string): void;
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
  const [uploadedImage, setUploadedImage] = React.useState(null as any);
  const [cropData, setCropData] = React.useState({
    isOpen: false,
    fileName: '',
    image: {} as any,
    crop: undefined as any
  })
  const { profileImage } = props;
  const handleClick = () => {
    if (profileImage) {
      props.setImage('');
    } else {
      openUploadDialog();
    }
  }

  const openUploadDialog = () => {
    setUploadDialog(true);
    /*
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".jpg, .jpeg, .png");
    el.click();

    // UPLOADING IMAGE TO BACKEND
    el.onchange = () => {
      if (el.files && el.files.length >= 0) {
        setUploadedImage(el.files[0]);

        uploadFile(
          el.files[0] as File,
          (res: any) => {
            const fileName = res.data.fileName;
            //props.setImage(fileName);
            setCropData({ ...cropData, crop: undefined, isOpen: true, fileName});
          },
          () => { }
        );
      }
    };
    */
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(',') as any;
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const uploadCropedFile = () => {
    let file = dataURLtoFile(state.result as any, state.filename as any);
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
    let className = "real-profile-image"
    if (props.imageUploadSuccess) {
      className += " upload-success";
    }
    if (profileImage) {
      return (
        <img
          src={`${process.env.REACT_APP_BACKEND_HOST}/files/${profileImage}`}
          className={className} alt=""
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

  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">{renderImage()}</div>
      <div className="add-image-button svgOnHover" onClick={handleClick}>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#plus"} className="text-white" />
        </svg>
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
          <button onClick={uploadCropedFile}>Save</button>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileImage;
