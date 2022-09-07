import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

const HowEmailUserPopup: React.FC<any> = () => {
  return (
    <div className="text-white italic library-e-r-label">
      <div className="hover-area-content">
        <div className="hover-area flex-center">
          <span>How will this information be used?</span>
          <div className="hover-content bold">
            Brillder does not send general publicity messages, and we will only contact you in specific circumstances, for example in case of an issue with your account.
            If you need to contact us, this also helps us verify who you are. Your email address will be securely stored, and will never be shared with a third party.
            Our full terms and conditions will be shown shortly, or you can click <a href="https://app.brillder.com/terms">here</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowEmailUserPopup;
