import React from 'react';

import './ProposalPhonePreview.scss';
import LastSave from '../../lastSave/LastSave';


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
    return <div className="custom-component"/>;
  }

  console.log('dd', savedHidden, updated)

  return (
    <div>
      <div className="proposal-phone-preview">
        {!savedHidden && updated &&
          <LastSave
            isSaving={false}
            updated={updated}
            saveError={false}
          />}
        <div className="phone">
          <div className="phone-border">
            <div className="volume volume1"></div>
            <div className="volume volume2"></div>
            <div className="volume volume3"></div>
            <div className="sleep"></div>
            <div className="screen">
              {renderInner()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalPhonePreview;
