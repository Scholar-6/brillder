import React, { useEffect } from "react";

import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";
import { User } from "model/user";

export enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  user: User;
  schoolName: string;
  moveBack(schoolName: string): void;
  moveNext(schoolName: string): void;
}

const Step1SchoolName: React.FC<ThirdProps> = (props) => {
  const [schoolName, setSchoolName] = React.useState(props.schoolName);

  useEffect(() => {
    if (props.user.isFromInstitution && !props.schoolName) {
      console.log('checking');
      let schoolNameInit = '';
      const domain = props.user.email.split("@")[1];
      if (domain === 'heartofmercia.org.uk') {
        schoolNameInit = 'Hereford Sixth Form College';
      } else if (domain === 'hereford.ac.uk') {
        schoolNameInit = 'Hereford Sixth Form College';
      } else if (domain === 'wsfc.ac.uk') {
        schoolNameInit = 'Worcester Sixth Form College';
      } else if (domain === 'kedst.ac.uk') {
        schoolNameInit = 'King Edward VI College';
      }

      setSchoolName(schoolNameInit);
    }
  }, []);

  const renderFullNameBox = () => {
    return (
      <div className="step1-name-box just-email">
        <div className="font-16">
          My current school:
        </div>
        <div className="step1-input-row email-part-s1 font-16">
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="School Name" />
        </div>
      </div>
    );
  }

  if (isPhone()) {
    return (
      <div className="question question-6 question-3-watching question-1-name">
        <img src="/images/choicesTool/Step1R25.png" className="step3watching-img-v2" />
        <div className="space-r1-34"></div>
        <div className="font-32 title-r1-34 bold">Where are you currently studying?</div>
        <div className="font-16 text-r1-34">Type in your current school below. (This is Optional)</div>
        {renderFullNameBox()}
        <div className="help-without absolute-name-s1 font-13">
          <div>
            <SpriteIcon name="help-without" />
          </div>
          <div className="text-dark-gray-s1">
            Remember: We <span className="bold">NEVER</span> sell your data. With your permission, we only share it with a school or college which you tell us is connected to your education.
          </div>
        </div>
        <BackButtonSix onClick={() => props.moveBack(schoolName)} />
        <NextButtonSix label="Continue" onClick={() => props.moveNext(schoolName)} />
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching question-1-name">
      <img src="/images/choicesTool/Step1R25.png" className="step3watching-img-v2" />
      <div className="font-32 bold">Where are you currently studying?</div>
      <div className="font-16">Type in your current school below. (This is Optional)</div>
      {renderFullNameBox()}
      <div className="help-without absolute-name-s1 font-16">
        <div>
          <SpriteIcon name="help-without" />
        </div>
        <div className="text-dark-gray-s1">
          Remember: We <span className="bold">NEVER</span> sell your data. With your permission, we only share it with a school or college which you tell us is connected to your education.
        </div>
      </div>
      <BackButtonSix onClick={() => props.moveBack(schoolName)} />
      <NextButtonSix label="Continue" onClick={() => props.moveNext(schoolName)} />
    </div>
  );
}

export default (Step1SchoolName);
