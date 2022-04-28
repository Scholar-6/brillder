import React from "react";
import { Dialog, Grid } from "@material-ui/core";
import DynamicFont from 'react-dynamic-font';

import { AcademicLevelLabels, Brick } from "model/brick";

import CoverImage from "./CoverImage";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { SubscriptionState, User } from "model/user";
import { checkAdmin, checkPublisher, isAorP } from "components/services/brickService";
import { isPhone } from "services/phone";
import { isMobile } from "react-device-detect";
import { stripHtml } from "components/build/questionService/ConvertService";
import CoverBioDialog from "components/baseComponents/dialogs/CoverBioDialog";
import { GENERAL_SUBJECT } from "components/services/subject";
import SponsorImageComponent from "./SponsorImage";
import CoverAuthorRow from "./components/coverAuthorRow/CoverAuthorRow";
import UnauthorizedUserDialogV2 from "components/baseComponents/dialogs/unauthorizedUserDialogV2/UnauthorizedUserDialogV2";

import { CreateByEmailRes } from "services/axios/user";
import HoveredImage from "../baseComponents/HoveredImage";
import CoverTimer from "./CoverTimer";
import map from "components/map";
import CoverCreditsPlay from "./components/coverAuthorRow/CoverCreditsPlay";
import ReactiveUserCredits from "components/userProfilePage/ReactiveUserCredits";


interface Props {
  user: User;
  brick: Brick;
  location: any;
  history: any;
  activeCompetition: any;
  canSeeCompetitionDialog?: boolean | null;
  setCompetitionId(id: number): void;
  setUser(data: CreateByEmailRes): void;
  moveNext(): void;
}

const MobileTheme = React.lazy(() => import('./themes/CoverMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/CoverTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/CoverDesktopTheme'));

const CoverPage: React.FC<Props> = ({ brick, ...props }) => {
  const [competitionData, setCompetitionData] = React.useState(null as any);
  const [bioOpen, setBio] = React.useState(false);
  const [editorBioOpen, setEditorBio] = React.useState(false);

  const [playClicked, setClickPlay] = React.useState(false);
  const [unauthPopupShown, setUnauthPopupShown] = React.useState(false)
  const [unauthorizedOpenV2, setUnauthorizedV2] = React.useState(false);

  const [firstPhonePopup, setFirstPhonePopup] = React.useState(false);
  const [secondPhonePopup, setSecondPhonePopup] = React.useState(false);

  const userTimeout = setTimeout(() => {
    if (!props.user) {
      setUnauthorizedV2(true);
    }
  }, 10000);


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

  useEffect(() => {
    if (props.activeCompetition && competitionData === null) {
      setCompetitionData({ isOpen: true, competition: props.activeCompetition });
    }
    /*eslint-disable-next-line*/
  }, [props.activeCompetition]);

  const startBrick = () => {
    props.moveNext();
  };

  const renderFirstRow = () => {
    return (
      <div className="first-row">
        <div className="brick-id-container">
          Brick N<sub className="smaller">o.</sub> {brick.id}
        </div>
        <div className="mobile-credit-coins">
          <ReactiveUserCredits />
        </div>
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

  const renderCoverPlay = () => {
    let isPublisher = false;
    if (props.user) {
      isPublisher = isAorP(props.user.roles);
    }
    return (
      <CoverCreditsPlay
        isAuthor={brick.author.id === props.user?.id} isPublisher={isPublisher}
        isLibraryUser={!!props.user?.library}
        isPaidEducator={props.user?.subscriptionState === SubscriptionState.PaidTeacher} isCompetition={!!props.activeCompetition}
        onClick={() => {
          if (props.user) {
            startBrick();
          } else {
            if (!unauthPopupShown) {
              setUnauthorizedV2(true);
            } else {
              startBrick();
            }
            setClickPlay(true);
          }
        }}
      />
    )
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
              <h1 dangerouslySetInnerHTML={{ __html: brick.title }} />
            </div>
          </div>
          <div className="author-row">
            <span onClick={() => setBio(true)}>
              <SpriteIcon name="feather-feather" />
              {brick.author.firstName} {brick.author.lastName}
            </span>
            {brick.editors && brick.editors.length > 0 && <div onClick={() => setEditorBio(true)}>, <SpriteIcon name="feather-edit-3" />{brick.editors[0].firstName} {brick.editors[0].lastName} (Editor)</div>}
          </div>
          {(brick.isCore || brick.subject?.name === GENERAL_SUBJECT) && <SponsorImageComponent
            user={props.user}
            brick={brick}
          />}
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
                      <div className="l-text">
                        <div>Core</div>
                        <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">III</div>
                      <div className="l-text">
                        <div>Extension</div>
                        <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) learners</div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
            <CoverTimer brickLength={brick.brickLength} />
          </div>
          <div className="introduction-info">
            {renderCoverPlay()}
          </div>
        </div>
        <UnauthorizedUserDialogV2
          history={props.history}
          brick={brick}
          isOpen={unauthorizedOpenV2}
          notyet={() => {
            if (playClicked) {
              startBrick()
            } else {
              setUnauthorizedV2(false);
            }
            setUnauthPopupShown(true);
          }}
          registered={() => {
            console.log('cover');
            if (playClicked) {
              startBrick()
            } else {
              setUnauthorizedV2(false);
            }
            setUnauthPopupShown(true);
          }}
        />
        <CoverBioDialog isOpen={bioOpen} user={brick.author} close={() => setBio(false)} />
        {brick.editors && brick.editors.length > 0 &&
          <CoverBioDialog isOpen={editorBioOpen} user={brick.editors[0] as any} close={() => setEditorBio(false)} />
        }
        {props.canSeeCompetitionDialog && competitionData &&
          <Dialog open={competitionData.isOpen} className="dialog-box phone-competition-dialog" onClose={() => setCompetitionData({ ...competitionData, isOpen: false })}>
            <div className="dialog-header phone-competition">
              <div className="flex-center">
                <SpriteIcon name="star-empty" className="big-star" />
              </div>
              <div className="bold" style={{ textAlign: 'center' }}>
                This brick is part of a competition. <br />
                If you do well, you could win a prize!
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-md  bg-green text-white yes-button" onClick={() => {
                props.setCompetitionId(competitionData.competition.id);
                setCompetitionData({ ...competitionData, isOpen: false });
                startBrick();
              }}>
                <span>Start Playing</span>
              </button>
            </div>
            <div className="italic bottom-link flex-center" style={{ textAlign: 'center' }}>
              <SpriteIcon name="eye-on" />
              <a rel="noopener noreferrer" href="https://brillder.com/brilliant-minds-prizes/" target="_blank">Learn more</a>
            </div>
          </Dialog>}
      </React.Suspense>
    );
  }

  const briefText = stripHtml(brick.brief);

  return (
    <React.Suspense fallback={<></>}>
      <HoveredImage />
      {isMobile ? <TabletTheme /> : <DesktopTheme />}
      <div className="brick-row-container cover-page">
        <div className="brick-container">
          <Grid container direction="row">
            <Grid item sm={8} xs={12}>
              <div className="introduction-page">
                <h1 className="brick-title q-brick-title dynamic-title">
                  {brick.adaptedFrom && !brick.isCore && <div className="adapted-text">ADAPTED</div>}
                  {brick.adaptedFrom && !brick.isCore && <SpriteIcon name="copy" />}<DynamicFont content={stripHtml(brick.title)} />
                </h1>
                <CoverAuthorRow brick={brick} setBio={setBio} setEditorBio={setEditorBio} />
                <div className="image-container centered">
                  <CoverImage
                    locked={!isPublisher && ((brick.isCore ?? false) || brick.author.id !== props.user?.id)}
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
                          <div className="l-text">
                            <div>Core</div>
                            <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                          </div>
                        </div>
                        <br />
                        <div className="container">
                          <div className="white-circle">III</div>
                          <div className="l-text">
                            <div>Extension</div>
                            <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) learners</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="keywords-row">
                    <SpriteIcon name="hash" />
                    <KeyWordsPreview keywords={brick.keywords} onClick={keyword => props.history.push('/play/dashboard?mySubject=true&searchString=' + keyword.name)} />
                    {!isMobile && props.user && checkAdmin(props.user.roles) && <div className="btn b-green text-white" onClick={() => props.history.push(map.Proposal(brick.id))}>Edit</div>}
                  </div>
                  <CoverTimer brickLength={brick.brickLength} />
                </div>
              </div>
            </Grid>
            <Grid item sm={4} xs={12}>
              <div className="introduction-info">
                {(brick.isCore || brick.subject?.name === GENERAL_SUBJECT) && <SponsorImageComponent
                  user={props.user}
                  brick={brick}
                />}
                <div className="brief-ellipsis">
                  {briefText}
                </div>
                {renderCoverPlay()}
              </div>
            </Grid>
          </Grid>
        </div>
        <CoverBioDialog isOpen={bioOpen} user={brick.author} close={() => setBio(false)} />
        {brick.editors && brick.editors.length > 0 &&
          <CoverBioDialog isOpen={editorBioOpen} user={brick.editors[0] as any} close={() => setEditorBio(false)} />
        }
      </div>
      <UnauthorizedUserDialogV2
        history={props.history}
        brick={brick}
        isOpen={unauthorizedOpenV2}
        notyet={() => {
          if (playClicked) {
            startBrick();
          } else {
            setUnauthorizedV2(false);
          }
          setUnauthPopupShown(true);
        }}
        registered={() => {
          console.log('cover');
          if (playClicked) {
            startBrick()
          } else {
            setUnauthorizedV2(false);
          }
          setUnauthPopupShown(true);
        }}
      />
      {props.canSeeCompetitionDialog && competitionData &&
        <Dialog open={competitionData.isOpen} className="dialog-box competition-dialog" onClose={() => setCompetitionData({ ...competitionData, isOpen: false })}>
          <div className="dialog-header">
            <div className="flex-center">
              <SpriteIcon name="star-empty" className="big-star" />
            </div>
            <div className="bold" style={{ textAlign: 'center' }}>
              This brick is part of a competition. <br />
              If you do well, you could win a prize!
            </div>
          </div>
          <div className="dialog-footer">
            <button className="btn btn-md bg-green text-white yes-button blue-on-hover" onClick={() => {
              props.setCompetitionId(competitionData.competition.id);
              setCompetitionData({ ...competitionData, isOpen: false });
              startBrick();
            }}>
              <span>Start Playing</span>
            </button>
          </div>
          <div className="italic bottom-link flex-center" style={{ textAlign: 'center' }}>
            <SpriteIcon name="eye-on" />
            <a rel="noopener noreferrer" href="https://brillder.com/brilliant-minds-prizes/" target="_blank">Learn more</a>
          </div>
        </Dialog>}
    </React.Suspense>
  );
};

export default CoverPage;
