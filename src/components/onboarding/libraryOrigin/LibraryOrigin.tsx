import React from 'react';
import { User } from 'model/user';
import { History } from "history";

import './LibraryOnboarding.scss';
import RealLibraryConnect from 'components/userProfilePage/RealLibraryCoonect';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import map from 'components/map';

interface LibraryOriginProps {
  user: User;
  history: History;
}

const LibraryOrigin: React.FC<LibraryOriginProps> = (props) => {
  if (!props.user) {
    return <PageLoader content="...Getting User..." />
  }
  
  return (
    <div className="LibraryOnboarding">
      <h1 className="title">Activate your Library Account</h1>
      <div className="sub-title-d563">If you are a member of one of our partner libraries, enter your Library Region/Authority, barcode, and pin to unlock premium access for free</div>
      <RealLibraryConnect user={props.user} reloadLibrary={() => {}} successPopupClosed={() => {
        // success
        props.history.push(map.UserPreferencePage);
      }} />
    </div>
  );
}

export default LibraryOrigin;
