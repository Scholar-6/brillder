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
      <h1 className="title">Activate your Library Account.</h1>
      <div className="sub-title-d563">Get a free premium account through a participating UK library</div>
      <RealLibraryConnect user={props.user} reloadLibrary={() => {
        // success
        props.history.push(map.UserPreferencePage);
      }} />
    </div>
  );
}

export default LibraryOrigin;
