import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface RegisterButtonProps {
  onClick(): void;
}

const LibraryDesktopButton: React.FC<RegisterButtonProps> = ({ onClick }) => {
  return (
    <button className="email-button library-login-button" onClick={onClick}>
      <SpriteIcon name="library-user-icon" className="active" />
      <span>UK library user</span>
      <div className="hover-area-content">
        <div className="hover-area flex-center">
          <SpriteIcon name="library-help" />
          <div className="hover-content bold">
            Available to members of
            participating UK libraries.
          </div>
        </div>
      </div>
    </button>
  );
};

export default LibraryDesktopButton;
