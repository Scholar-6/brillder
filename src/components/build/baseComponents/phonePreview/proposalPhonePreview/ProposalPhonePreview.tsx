import React from 'react';

import './ProposalPhonePreview.scss';
import LastSave from '../../lastSave/LastSave';
import BasePhonePreview from 'components/baseComponents/BasePhonePreview';


export interface ProposalPhonePreviewProps {
  link?: string
  Component?: any
  savedHidden?: boolean;
  updated?: string;
  data?: any
}

const ProposalPhonePreview: React.FC<ProposalPhonePreviewProps> = ({ link, updated, savedHidden, Component, data }) => {
  const renderInner = () => {
    if (link) {
      return (
        <div className="custom-component">
          <iframe title="phone-preview-screen" src={link} />
        </div>
      );
    }
    if (Component) {
      return (
        <div className="custom-component">
          <Component data={data} />
        </div>
      );
    }
    return <div className="custom-component" />;
  }

  return (
    <div>
      <div className="proposal-phone-preview">
        {!savedHidden && updated &&
          <LastSave
            isEditor={false}
            isSaving={false}
            updated={updated}
            saveError={false}
          />}
        <BasePhonePreview>
          {renderInner()}
        </BasePhonePreview>
      </div>
    </div>
  );
}

export default ProposalPhonePreview;
