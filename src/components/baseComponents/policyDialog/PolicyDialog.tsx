import React from 'react';
import Dialog from "@material-ui/core/Dialog";

import './PolicyDialog.scss';
import SpriteIcon from '../SpriteIcon';

interface PolicyDialogProps {
  isOpen: boolean;
  close(): void;
}

const PolicyDialog: React.FC<PolicyDialogProps> = (props) => {
  const renderBrillderLabel = () => {
    return <span>Brillder<sup style={{ fontSize: '0.75vw' }}>TM</sup></span>;
  }

  return (
    <Dialog open={props.isOpen} onClose={() => props.close()} className="dialog-box privacy-policy-dialog">
      <div className="private-policy-content">
        <div className="close-button svgOnHover" onClick={props.close}>
          <SpriteIcon name="cancel" className="w100 h100 active" />
        </div>
        <h1 className="private-policy-title">Privacy Policy</h1>
        <p>
          Your privacy is important to us. It is Scholar 6’s policy to respect your privacy
          regarding any information we may collect from you when using {renderBrillderLabel()}. We
          try to keep this as simple and self-explanatory as possible.
        </p>

        <h4>What is a brick?</h4>
        <p>
          A brick is a unit of digital content which is published at a specific url on our web
          application. This is partially public and details such as your username and/or
          your full name may be displayed for the general public to view if your brick is
          published to our library.
        </p>
        <p>
          The default status of a brick is private, however you are able to share a link
          publicly to your bricks at your own discretion.  In order to keep our platform
          safe from inappropriate activity, our administrators will be able to monitor
          content for any breach of our <strong>Community Guidelines</strong>
        </p>

        <h4>What information do we collect?</h4>
        <p>
          We currently store your email, first name, last name, a Google id (if you have
          logged in with Google), a username, subjects you have selected as relevant to
          you, and any additional details you have added to your profile.
        </p>
        <p>
          In order to optimise development and cross-platform compatibility, we track
          every request to our API (Application Programming Interface). This means that
          actions like adding, editing or playing a brick will be stored.
        </p>
        <p>
          For the application to function as (we hope!) you would expect it to (ie. for your
          actions to be remembered from page-to-page while navigating) we also track
          your user session using a session cookie. If you delete this cookie then you will
          need to login again in order to access your account.
        </p>
        <p>
          There is absolutely no external advertising on our platform, and we do not give
          your data to any third parties. See  our <strong>Cookie Policy (below)</strong> for more
          information.
        </p>

        <h4>What is the Legal basis for collecting this information?</h4>
        <p>
          By signing up to Brillder, agreeing to this policy and using the service, you are
          providing informed consent. It is also in the legitimate interest of Scholar 6
          Limited to provide a better service to our users. Both of these reasons form the
          legal basis for storing and using your information.
        </p>

        <h4>How do we use your information?</h4>
        <p>
          We use this information to provide a better service for our users including
          sending notifications when other users edit, suggest changes, or play your
          bricks. From time to time, we may also send marketing communications to your
          email, from which you may opt out in the app.
        </p>
        <p>
          We may use aggregate data from many different people with a machine learning
          algorithm to learn patterns of behaviour which can help us improve your
          experience of the system.
        </p>

        <h4>What are your rights?</h4>
        <p>You have the following rights:</p>
        <ol>
          <li>The right to be informed</li>
          <li>The right of access</li>
          <li>The right to rectification</li>
          <li>The right to erasure</li>
          <li>The right to restrict processing</li>
          <li>The right to data portability</li>
          <li>The right to object</li>
          <li>Rights in relation to automated decision making and profiling.</li>
        </ol>

        <h4>Who controls this information?</h4>
        <p>
          The controller of this information is Scholar 6 Limited, which is a registered
          company in England. You can contact us using the ‘Help’ button in the bottom
          left of each Brillder webpage or by emailing admin@scholar6.org
        </p>

        <h4>Do we share this information?</h4>
        <p>
          Your details will only be shared with other Brillder users on an individual and
          consensual basis.  A learner must first accept a teacher’s invitation for the
          teacher to see their play attempts and learning records for the subject(s) they
          teach. As above, we do <strong>not</strong> share lists of user details with any third parties (such
          as selling your email as part of a list to another company).
        </p>

        <h4>How do you revoke your consent?</h4>
        <p>
          To revoke your consent for us to use your personal information at any time
          please email admin@scholar6.org. We can delete your account and all private
          data, however details such as your name which you have elected to publish
          publicly on your bricks are no longer private and may stay associated with the
          bricks you created.
        </p>

        <h3>Cookie Policy</h3>
        <p style={{ marginBottom: 0 }}>
          When accessing {renderBrillderLabel()} without logging in, there is a Zendesk widget (for
          reporting issues or sending us a message) that uses a cookie called __zlcmid, this
          can track your machine ID to any other website that uses Zendesk for up to 1
          year. Please read the Zendesk documentation on their separate website for
          more information.
        </p>
        <a rel="noopener noreferrer" target="_blank" style={{ marginBottom: '1vh' }}
          href="https://support.zendesk.com/hc/en-us/articles/360022367393-Zendesk-in-product-cookie-policy">
          https://support.zendesk.com/hc/en-us/articles/360022367393-Zendesk-in-product-cookie-policy
        </a>
        <p style={{ marginTop: '2vh' }}>
          By signing up with a user account and accepting the terms of use, you are
          agreeing to the use of various cookies that are associated with your user profile
          and personal details when logged in to {renderBrillderLabel()}.
        </p>
        <p>
          You can reject these cookies being used to track you at any time by signing out
          of your account in the top right corner.
        </p>

        <h4>This policy is effective as of 29 July 2020.</h4>
      </div>
    </Dialog>
  );
}

export default PolicyDialog;
