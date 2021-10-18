import React from "react";
import { Grid } from "@material-ui/core";
import DynamicFont from 'react-dynamic-font';

import { AcademicLevelLabels, Brick } from "model/brick";

import CoverImage from "./CoverImage";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { User } from "model/user";
import { checkPublisher } from "components/services/brickService";
import { isPhone } from "services/phone";
import { isMobile } from "react-device-detect";
import { stripHtml } from "components/build/questionService/ConvertService";
import CoverBioDialog from "components/baseComponents/dialogs/CoverBioDialog";
import { GENERAL_SUBJECT } from "components/services/subject";
import SponsorImageComponent from "./SponsorImage";
import CoverAuthorRow from "./components/coverAuthorRow/CoverAuthorRow";
import CoverPlay from "./components/coverAuthorRow/CoverPlay";
import UnauthorizedUserDialogV2 from "components/baseComponents/dialogs/unauthorizedUserDialogV2/UnauthorizedUserDialogV2";
import TextDialog from "components/baseComponents/dialogs/TextDialog";

import { CreateByEmailRes, createUserByEmail } from "services/axios/user";
import HoveredImage from "../baseComponents/HoveredImage";
import CoverTimer from "./CoverTimer";


interface Props {
  user: User;
  brick: Brick;
  location: any;
  history: any;
  setUser(data: CreateByEmailRes): void;
  moveNext(): void;
}

const MobileTheme = React.lazy(() => import('./themes/CoverMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/CoverTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/CoverDesktopTheme'));

const CoverPage: React.FC<Props> = ({ brick, ...props }) => {
  const [bioOpen, setBio] = React.useState(false);

  const [playClicked, setClickPlay] = React.useState(false);
  const [unauthPopupShown, setUnauthPopupShown] = React.useState(false)
  const [unauthorizedOpenV2, setUnauthorizedV2] = React.useState(false);

  const [firstPhonePopup, setFirstPhonePopup] = React.useState(false);
  const [secondPhonePopup, setSecondPhonePopup] = React.useState(false);
  const [emailInvalidPopup, setInvalidEmailPopup] = React.useState(false); // null - before submit button clicked, true - invalid
  const [emailInvalid, setInvalidEmail] = React.useState<boolean | null>(null); // null - before submit button clicked, true - invalid

  useEffect(() => {
    const userTimeout = setTimeout(() => {
      if (!props.user) {
        setUnauthorizedV2(true);
      }
    }, 10000);
  }, [])

  const validate = (data: any) => {
    if (data === 400) {
      setInvalidEmailPopup(true);
    }
    setInvalidEmail(true);
  }

  const createInactiveAccountV2 = async (email: string) => {
    if (!props.user) {
      // create a new account for an unauthorized user.
      const data = await createUserByEmail(email);
      if (data === 400 || !data) {
        validate(data);
      } else {
        props.setUser(data);
        setUnauthorizedV2(false);
        startBrick();
      }
    }
  }

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        startBrick();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
      clearTimeout(userTimeout);
    };
  });

  const startBrick = () => {
    props.moveNext();
  };

  const renderFirstRow = () => {
    return (
      <div className="first-row">
        <div className="brick-id-container">Brick #{brick.id}</div>
        <div className="question">What is a brick?</div>
        <div className="hover-area">
          <SpriteIcon name="help-circle-custom" onClick={() => setFirstPhonePopup(true)} />
          {!isPhone() &&
            <div className="hover-content">
              <div>A brick is a learning unit that should take either 20, 40, or 60 minutes to complete.</div>
              <br />
              <div>Bricks follow a cognitively optimised sequence:</div>
              <div className="container">
                <div className="white-circle">1</div>
                <div className="l-text">
                  Preparation: <span className="regular">stimulus content gets you in the zone.</span>
                </div>
              </div>
              <div className="container">
                <div className="white-circle">2</div>
                <div className="l-text">
                  Investigation: <span className="regular">challenging interactive questions make you think.</span>
                </div>
              </div>
              <div className="container">
                <div className="white-circle">3</div>
                <div className="l-text">
                  <span className="regular">A preliminary score</span>
                </div>
              </div>
              <div className="container">
                <div className="white-circle">4</div>
                <div className="l-text">
                  Synthesis: <span className="regular">explanation.</span>
                </div>
              </div>
              <div className="container">
                <div className="white-circle">5</div>
                <div className="l-text">
                  Review: <span className="regular">hints help you correct your answers.</span>
                </div>
              </div>
              <div className="container">
                <div className="white-circle">6</div>
                <div className="l-text">
                  <span className="regular">A final score</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  };

  let isPublisher = false;
  if (props.user) {
    isPublisher = checkPublisher(props.user, brick);
  }

  const renderBrickCircle = () => {
    return (
      <div className="round-button-container">
        <div className="round-button" style={{ background: `${brick.subject?.color || '#B0B0AD'}` }} />
      </div>
    );
  }

  if (isPhone()) {
    return (
      <React.Suspense fallback={<></>}>
        <HoveredImage />
        <MobileTheme />
        <div className="cover-page">
          {renderFirstRow()}
          <div className="brick-title q-brick-title">
            {brick.adaptedFrom && <div className="adapted-text">ADAPTED</div>}
            <div>
              {brick.adaptedFrom && <SpriteIcon name="copy" />}
              <div dangerouslySetInnerHTML={{ __html: brick.title }} />
            </div>
          </div>
          <div className="author-row">{brick.author.firstName} {brick.author.lastName}</div>
          <div className="keywords-row">
            <KeyWordsPreview keywords={brick.keywords} />
          </div>
          <div className="image-container centered">
            <CoverImage
              locked={!isPublisher && ((brick.isCore ?? false) || brick.author.id !== props.user.id)}
              brickId={brick.id}
              data={{ value: brick.coverImage, imageSource: brick.coverImageSource, imageCaption: brick.coverImageCaption, imagePermision: false }}
            />
            <div className="cover-info-row">
              {renderBrickCircle()}
              <span>{brick.subject?.name}, Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}</span>
              <SpriteIcon name="help-circle-custom" onClick={() => setSecondPhonePopup(true)} />
              {firstPhonePopup &&
                <div className="mobile-help-container" onClick={() => setFirstPhonePopup(false)}>
                  <div>A brick is a learning unit that should take either 20, 40, or 60 minutes to complete.</div>
                  <br />
                  <div>Bricks follow a cognitively optimised sequence:</div>
                  <div className="container">
                    <div className="white-circle">1</div>
                    <div className="l-text">
                      Preparation: <span className="regular">stimulus content gets you in the zone.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">2</div>
                    <div className="l-text">
                      Investigation: <span className="regular">challenging interactive questions make you think.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">3</div>
                    <div className="l-text">
                      <span className="regular">A preliminary score</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">4</div>
                    <div className="l-text">
                      Synthesis: <span className="regular">explanation.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">5</div>
                    <div className="l-text">
                      Review: <span className="regular">hints help you correct your answers.</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="white-circle">6</div>
                    <div className="l-text">
                      <span className="regular">A final score</span>
                    </div>
                  </div>
                </div>}
              {secondPhonePopup &&
                <div className="mobile-help-container second" onClick={() => setSecondPhonePopup(false)}>
                  <div className="flex-content">
                    <div>Brillder focusses on universal concepts and topics, not specific exam courses.</div>
                    <br />
                    <div>LEVELS:</div>
                    <div className="container">
                      <div className="white-circle">I</div>
                      <div className="l-text">
                        <div>Foundation</div>
                        <div className="regular">For 15-16 yr-olds, equivalent to GCSE / IB Middle Years / High School Diploma</div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">II</div>
                      <div className="and-sign">&</div>
                      <div className="white-circle">III</div>
                      <div className="l-text smaller">
                        <div>Core</div>
                        <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">IV</div>
                      <div className="l-text">
                        <div>Extension</div>
                        <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) students</div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
            <CoverTimer brickLength={brick.brickLength} />
          </div>
          <div className="introduction-info">
            <CoverPlay onClick={() => {
              if (props.user) {
                startBrick();
              } else {
                setUnauthorizedV2(true);
                setClickPlay(true);
              }
            }}
            />
          </div>
        </div>
        <UnauthorizedUserDialogV2
          history={props.history}
          brickId={brick.id}
          isOpen={unauthorizedOpenV2}
          emailInvalid={emailInvalid}
          notyet={() => {
            if (playClicked) {
              startBrick()
            } else {
              setUnauthorizedV2(false);
            }
            setUnauthPopupShown(true);
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<></>}>
      <HoveredImage />
      {isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="brick-row-container cover-page">
        <div className="brick-container">
          <Grid container direction="row">
            <Grid item sm={8} xs={12}>
              <div className="introduction-page">
                {renderFirstRow()}
                <div className="brick-title q-brick-title dynamic-title">
                  {brick.adaptedFrom && !brick.isCore && <div className="adapted-text">ADAPTED</div>}
                  {brick.adaptedFrom && !brick.isCore && <SpriteIcon name="copy" />}<DynamicFont content={stripHtml(brick.title)} />
                </div>
                <CoverAuthorRow brick={brick} setBio={setBio} />
                {(brick.isCore || brick.subject?.name === GENERAL_SUBJECT) && <SponsorImageComponent
                  user={props.user}
                  brick={brick}
                />}
                <div className="image-container centered">
                  <CoverImage
                    locked={!isPublisher && ((brick.isCore ?? false) || brick.author.id !== props.user.id)}
                    brickId={brick.id}
                    data={{ value: brick.coverImage, imageSource: brick.coverImageSource, imageCaption: brick.coverImageCaption, imagePermision: false }}
                  />
                  <div className="cover-info-row">
                    {renderBrickCircle()}
                    <div className="subject-and-name">
                      {brick.subject?.name},
                      Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
                    </div>
                    <div className="hover-area flex-center">
                      <SpriteIcon name="help-circle-custom" />
                      <div className="hover-content">
                        <div>Brillder focusses on universal concepts and topics, not specific exam courses.</div>
                        <br />
                        <div>LEVELS:</div>
                        <div className="container">
                          <div className="white-circle">I</div>
                          <div className="l-text">
                            <div>Foundation</div>
                            <div className="regular">For 15-16 yr-olds, equivalent to GCSE / IB Middle Years / High School Diploma</div>
                          </div>
                        </div>
                        <br />
                        <div className="container">
                          <div className="white-circle">II</div>
                          <div className="flex-center and-sign">&</div>
                          <div className="white-circle">III</div>
                          <div className="l-text">
                            <div>Core</div>
                            <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                          </div>
                        </div>
                        <br />
                        <div className="container">
                          <div className="white-circle">IV</div>
                          <div className="l-text">
                            <div>Extension</div>
                            <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) students</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CoverTimer brickLength={brick.brickLength} />
                </div>
                <div className="keywords-row">
                  <KeyWordsPreview keywords={brick.keywords} />
                </div>
              </div>
            </Grid>
            <Grid item sm={4} xs={12}>
              <div className="introduction-info">
                <CoverPlay onClick={() => {
                  if (props.user) {
                    startBrick();
                  } else {
                    setUnauthorizedV2(true);
                    setClickPlay(true);
                  }
                }} />
              </div>
            </Grid>
          </Grid>
        </div>
        <CoverBioDialog isOpen={bioOpen} user={brick.author} close={() => setBio(false)} />
      </div>
      <UnauthorizedUserDialogV2
        history={props.history}
        brickId={brick.id}
        isOpen={unauthorizedOpenV2}
        emailInvalid={emailInvalid}
        notyet={() => {
          if (playClicked) {
            startBrick();
          } else {
            setUnauthorizedV2(false);
          }
          setUnauthPopupShown(true);
        }}
      />
      <TextDialog
        isOpen={emailInvalidPopup} close={() => setInvalidEmailPopup(false)}
        label="You might already have an account, try signing in."
      />
    </React.Suspense>
  );
};

export default CoverPage;
