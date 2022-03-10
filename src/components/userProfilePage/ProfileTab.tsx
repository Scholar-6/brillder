import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import './ProfileTab.scss';

interface Props {
  isProfile?: boolean;
  onSwitch(): void;
}

const ProfileTab: React.FC<Props> = ({ isProfile, onSwitch }) => {

  return (
    <div className="profile-tab bold">
      <div className={isProfile ? 'active' : ''} onClick={() => !isProfile && onSwitch()}>
        <SpriteIcon name="user" />
        My Profile
      </div>
      <div className={isProfile ? '' : 'active'} onClick={() => isProfile && onSwitch()}>
        <SpriteIcon name="feather-box" />
        Manage Account
      </div>
    </div>
  );
}

export default ProfileTab;
