import React from "react";

import './ShortBrickDescription.scss';
import './PhoneTopBrick16x9.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import { User, UserPreferenceType } from "model/user";
import BrickCircle from "./BrickCircle";
import BrickTitle from "./BrickTitle";
import { fileUrl } from "components/services/uploadFile";
import CompetitionTimer from "components/viewAllPage/components/CompetitionTimer";
import { checkCompetitionActive } from "services/competition";
import SpriteIcon from "./SpriteIcon";
import { getBrickColor } from "services/brick";
import { checkAssignment } from "components/viewAllPage/service/viewAll";
import { ReactComponent as CircleCheck } from 'assets/img/circle-check.svg';

interface Props {
  brick: Brick;
  user?: User;
  onClick?(): void;
}

const PhoneTopBrickScroll16x9 = React.forwardRef<HTMLDivElement, Props>(({ brick, user, onClick }, ref) => {
  const color = getBrickColor(brick);
  const isAssignment = checkAssignment(brick, user);
  const [imgLoaded, setLoaded] = React.useState(false);

  let label = '';
  if (brick.academicLevel >= AcademicLevel.First) {
    label = AcademicLevelLabels[brick.academicLevel];
  }

  const renderCompetitionBanner = () => {
    if (user?.userPreference?.preferenceId === UserPreferenceType.Teacher) {
      return '';
    }
    if (brick.competitions && brick.competitions.length > 0) {
      const foundActive = brick.competitions.find(checkCompetitionActive);
      if (foundActive) {
        return (
          <div>
            <CompetitionTimer competition={foundActive} />
            <div className="competition-baner"><SpriteIcon name="star" /> competition</div>
          </div>
        );
      }
    }
    return '';
  }

  const renderFirstCircle = () => {
    if (color) {
      return (
        <BrickCircle
          color={color}
          isAssignment={isAssignment}
          canHover={true}
          label={label}
          onClick={e => { }}
        />
      );
    }
    return '';
  }

  const renderSecondCircle = () => {
    if (brick.alternateSubject) {
      return (
        <BrickCircle
          color={brick.alternateSubject.color}
          circleClass="alternative-subject"
          isAssignment={isAssignment}
          canHover={true}
          label=""
          onClick={e => { }}
        />
      );
    }
    return '';
  }

  const renderCircles = () => {
    let alternateColor = brick.alternateSubject ? brick.alternateSubject.color : color;
    return (
      <div className="level-and-length">
        <div className="level before-alternative">
          <div style={{ background: color }}>
            <div className="level">
              <div style={{ background: alternateColor }}>
                {(isAssignment || brick.currentUserAttempted) ? <CircleCheck /> : AcademicLevelLabels[brick.academicLevel]}
              </div>
            </div>
          </div>
        </div>
        <div className="length-text-r3">{brick.brickLength} min</div>
      </div>
    );
  }

  if (ref) {
    return (
      <div ref={ref} className={brick.alternateSubject ? "phone-top-brick-16x9 alternative-subject-container" : "phone-top-brick-16x9"} onClick={() => onClick ? onClick() : {}}>
        {renderCompetitionBanner()}
        {renderCircles()}
        <div className="p-blue-background" />
        <img alt="" className={`p-cover-image ${imgLoaded ? 'visible' : 'hidden'}`} onLoad={() => setLoaded(true)} src={fileUrl(brick.coverImage)} />
        <div className="bottom-description-color" />
        <div className="bottom-description">
          <BrickTitle title={brick.title} />
        </div>
      </div >
    );
  }

  return (
    <div className={brick.alternateSubject ? "phone-top-brick-16x9 alternative-subject-container" : "phone-top-brick-16x9"} onClick={() => onClick ? onClick() : {}}>
      {renderCompetitionBanner()}
      {renderCircles()}
      <div className="p-blue-background" />
      <img alt="" className={`p-cover-image ${imgLoaded ? 'visible' : 'hidden'}`} onLoad={() => setLoaded(true)} src={fileUrl(brick.coverImage)} />
      <div className="bottom-description-color" />
      <div className="bottom-description">
        <BrickTitle title={brick.title} />
      </div>
    </div >
  );
})

export default PhoneTopBrickScroll16x9;
