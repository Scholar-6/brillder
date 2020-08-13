import React from "react";

import sprite from "assets/img/icons-sprite.svg";
import { uploadFile } from "components/services/uploadFile";

interface ProfileImageProps {
  imageUploadSuccess: boolean;
  profileImage: string;
  setImage(profileImage: string): void;
}

const ProfileImage: React.FC<ProfileImageProps> = (props) => {
  const {profileImage} = props;
  const handleClick = () => {
    if (profileImage) {
      props.setImage('');
    } else {
      openUploadDialog();
    }
  }

  const openUploadDialog = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".jpg, .jpeg, .png");
    el.click();

    // UPLOADING IMAGE TO BACKEND
    el.onchange = () => {
      if (el.files && el.files.length >= 0) {
        uploadFile(
          el.files[0] as File,
          (res: any) => {
            const fileName = res.data.fileName;
            props.setImage(fileName);
          },
          () => {}
        );
      }
    };
  };

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
    </div>
  );
};

export default ProfileImage;

