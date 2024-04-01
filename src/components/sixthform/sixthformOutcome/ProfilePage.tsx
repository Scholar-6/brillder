import React from 'react';

import { User } from 'model/user';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface Props {
  user: User;
}

const ProfilePage: React.FC<Props> = ({ user }) => {
  const [firstName, setFirstName] = React.useState(user.firstName);
  const [lastName, setLastName] = React.useState(user.lastName);
  const [email, setEmailName] = React.useState(user.email);
  const [newPassword, setNewPassword] = React.useState('');

  const [isEditing, setEditing] = React.useState(false);

  const save = () => {
    // saving 
    
  }

  let rName = (firstName ? firstName[0] : '') + (lastName[0] ? lastName[0] : '');
  return <div className="profile-container">
    <div className="text-center bold font-28">My Profile</div>
    {isEditing ? <div className="top-btn-container">
      <div className="save-btn font-16" onClick={() => save()}>Save</div>
    </div> :
    <div className="top-btn-container" onClick={() => setEditing(true)}>
      <SpriteIcon name="edit-icon-sixthform" className="pencil-btn" />
      <div className="css-custom-tooltip font-14">
        Edit Profile
      </div>
    </div>}
    <div className="flex-center">
      <div className="lozengue-r44 bold flex-center font-40">{rName}</div>
    </div>
    <div className="input-boxes font-20">
      <div>
        <span className="label">FIRST NAME</span>
        <input value={firstName} onChange={e => isEditing && setFirstName(e.target.value)} />
      </div>
      <div>
        <span className="label">LAST NAME</span>
        <input value={lastName} onChange={e => isEditing && setLastName(e.target.value)} />
      </div>
      <div>
        <span className="label">EMAIL</span>
        <input value={email} onChange={e => isEditing && setEmailName(e.target.value)} />
      </div>
      <div>
        <span className="label">PASSWORD</span>
        <input value={newPassword} placeholder="●●●●●●●●●●●" type="password" onChange={e => isEditing && setNewPassword(e.target.value)} />
      </div>
    </div>
  </div>
}

export default ProfilePage;
