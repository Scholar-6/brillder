import React from 'react';
import { isPhone } from 'services/phone';

const Partners: React.FC<any> = () => {
  if (isPhone()) {
    return (
      <div>
        <div className="partners">
          <div>
            <img className="hereford" src="/images/partners/logo-work-hereford.png" />
          </div>
          <div>
            <img className="sixthform" src='/images/partners/site_logo.png' />
          </div>
          <div>
            <img className="King-Edwards" src='/images/partners/King-Edwards-Logo-White.png' />
          </div>
        </div>
        <div className="partners">
          <div>
            <img className="King-Edwards6" src='/images/partners/KEC-Colour-Logo.png' />
          </div>
          <div>
            <img className="worcester" src='/images/partners/College-Logo-Transparent 1.png' />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="partners">
      <div>
        <img className="hereford" src="/images/partners/logo-work-hereford.png" />
      </div>
      <div>
        <img className="sixthform" src='/images/partners/site_logo.png' />
      </div>
      <div>
        <img className="King-Edwards" src='/images/partners/King-Edwards-Logo-White.png' />
      </div>
      <div>
        <img className="King-Edwards6" src='/images/partners/KEC-Colour-Logo.png' />
      </div>
      <div>
        <img className="worcester" src='/images/partners/College-Logo-Transparent 1.png' />
      </div>
    </div>
  );
}


export default Partners;
