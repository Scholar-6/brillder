import React from 'react';
import Card from '@material-ui/core/Card';

import './PolicyPage.scss';

const PolicyPage: React.FC<any> = (props) => {
  return (
    <div className="private-policy-page">
      <Card className="private-policy-box">
        <h1 className="private-policy-title">Privacy policy</h1>
        <p>
          Your privacy is important to us. It is Scholar 6’s policy to respect your privacy
          regarding any information we may collect from you when using the Brillder application.
          We try to keep this as simple and self explanatory as possible.
        </p>

        <h4>**What information do we collect?**</h4>
        <p>
          We currently store your email, first name, last name, a google id (if you have logged in with Google),
          a username, subjects you have selected as relevant to you, and any bio that you have added to your profile.
          Additionally to this we track every request to our API, this includes when you add bricks, edit bricks or play a brick.
        </p>
        <p>
          We also track your user session using a session cookie, more information can be found in our cookie policy.
        </p>

        <h4>**What is a brick?**</h4>
        <p>
          A brick is a unit of digital content which is published at a specific url on our web application.
          This is partially public and details such as your username and/or your full name may be displayed for the general public to view.
        </p>

        <h4>**What is the Legal basis for collecting this information?**</h4>
        <p>
          By signing up to Brillder agreeing to this policy and using the service you are providing informed consent
          and it is in the legitimate interest of Scholar 6 Limited to provide a better service to users.
        Both of these reasons are the basis for storing and using the above information.</p>

        <h4>**How do we use your information?**</h4>
        <p>
          We use this information to provide a better service for users including notifications when other users edit,
          suggest changes or play your bricks. We may also from time to time send marketing communications to your email.
          We may use aggregate data from many different people with a machine learning
          algorithm to learn patterns of behaviour which can help us improve the system.
        </p>

        <h4>**How do we collect this information?**</h4>
        <p>
          We currently collect this information directly from you using the profile page and other forms,
          as well as actions you take when using the system.
        </p>

        <h4>**What are your rights?**</h4>
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

        <h4>**Who is the controller of this information?**</h4>
        <p>
          The controller of this information is Scholar 6 Limited,
          which is a registered company in England.
          You can contact us using the button in the bottom left or emailing admin@scholar6.org
        </p>
        <h4>**Do we share this information?**</h4>
        <p>
          On an individual basis your details will be shared with other users.
          For example a teacher will be able to see a students name and the play attempts made on different bricks. We do not share lists of user details with 3rd parties (such as selling your email as part of a list to another company).
        </p>
        <h4>**How do you revoke your consent?**</h4>
        <p>
          To revoke your consent to use your personal information at any time please email admin@scholar6.org.
          We can delete your account and all private data, however details such as your name
          which you have elected to publish publicly on your bricks are no longer private and may stay associated with the bricks you created.
        </p>
        <h4>**This policy is effective as of 29 July 2020.**</h4>
      </Card>
    </div>
  );
}

export default PolicyPage;
