import React from "react";
import sprite from "assets/img/icons-sprite.svg";

interface ProfileImageProps {}

const ProfileImage: React.FC<ProfileImageProps> = (props) => {
  return (
    <div className="profile-image-container">
      <div className="profile-image svgOnHover">
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#user"} className="text-theme-dark-blue" />
        </svg>
      </div>
      <div className="add-image-button svgOnHover">
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
