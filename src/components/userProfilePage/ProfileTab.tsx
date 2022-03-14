import React from 'react';

import './ProfileTab.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import UserTypeLozenge from "./UsertypeLozenge";
import { UserPreference } from 'model/user';


interface Props {
  isProfile?: boolean;
  roles: any[];
  userPreference?: UserPreference;
  onSwitch(): void;
}

const ProfileTab: React.FC<Props> = ({ roles, userPreference, isProfile, onSwitch }) => {

  return (
    <div className="profile-tab bold">
      <div className={isProfile ? 'active' : ''} onClick={() => !isProfile && onSwitch()}>
        <SpriteIcon name="user" />
        My Profile
        <UserTypeLozenge roles={roles} userPreference={userPreference} />
      </div>
      <div className={isProfile ? '' : 'active'} onClick={() => isProfile && onSwitch()}>
        <SpriteIcon name="feather-box" />
        Manage Account
      </div>
    </div>
  );
}

export default ProfileTab;
