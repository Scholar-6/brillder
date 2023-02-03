import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import DynamicFont from 'react-dynamic-font';
import queryString from 'query-string';
import { isMobile } from "react-device-detect";

import CoverImage from "./CoverImage";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CoverBioDialog from "components/baseComponents/dialogs/CoverBioDialog";
import SponsorImageComponent from "./SponsorImage";
import CoverAuthorRow from "./components/coverAuthorRow/CoverAuthorRow";
import UnauthorizedUserDialogV2 from "components/baseComponents/dialogs/unauthorizedUserDialogV2/UnauthorizedUserDialogV2";
import HoveredImage from "../baseComponents/HoveredImage";
import CoverTimer from "./CoverTimer";
import MathInHtml from "../baseComponents/MathInHtml";
import CompetitionDialog from "./components/CompetitionDialog";
import CoverCreditsPlay from "./components/coverAuthorRow/CoverCreditsPlay";
import ReactiveUserCredits from "components/userProfilePage/ReactiveUserCredits";

import map from "components/map";
import { isPhone } from "services/phone";
import { stripHtml } from "components/build/questionService/ConvertService";
import { GENERAL_SUBJECT } from "components/services/subject";
import { AcademicLevelLabels, Brick } from "model/brick";
import { CreateByEmailRes } from "services/axios/user";
import { rightKeyPressed } from "components/services/key";
import { SubscriptionState, User } from "model/user";
import { checkAdmin, checkPublisher, isAorP } from "components/services/brickService";


interface Props {
  user: User;
  brick: Brick;
  location: any;
  history: any;
  competitionId: number;
  activeCompetition: any;
  isAssignment: boolean;
  canSeeCompetitionDialog?: boolean | null;
  setCompetitionId(id: number): void;
  setUser(data: CreateByEmailRes): void;
  moveNext(): void;
}

const MobileTheme = React.lazy(() => import('./themes/CoverMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/CoverTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/CoverDesktopTheme'));

const CoverPage: React.FC<Props> = ({ brick, ...props }) => {
  const [competitionData, setCompetitionData] = useState(null as any);
  const [bioOpen, setBio] = useState(false);
  const [editorBioOpen, setEditorBio] = useState(false);
  const [onlyLibrary, setOnlyLibrary] = useState(false);

  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.origin === 'library') {
      setOnlyLibrary(true);
    }
  }, []);

  const [playClicked, setClickPlay] = useState(false);
  const [unauthPopupShown, setUnauthPopupShown] = useState(false)
  const [unauthorizedOpenV2, setUnauthorizedV2] = useState(false);

  const [firstPhonePopup, setFirstPhonePopup] = useState(false);
  const [secondPhonePopup, setSecondPhonePopup] = useState(false);

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        startBrick();
      }
    }

    const userTimeout = setTimeout(() => {
      if (!props.user) {
        setUnauthorizedV2(true);
      }
    }, 20000);
    

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
    if (!props.user && onlyLibrary) {
      setUnauthorizedV2(false);
    } else {
      props.moveNext();
    }
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
    if (brick.alternateSubject) {
      return (
        <div className="round-button-container double-subjects">
          <div className="round-button" style={{ background: `${brick.alternateSubject?.color || '#B0B0AD'}` }} />
          <div
            className="round-button after-main-subject"
            style={{ background: brick.subject?.color }}
          />
        </div>
      );
    }

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
        user={props.user}
        isAssignment={props.isAssignment}
        isAuthor={brick.author.id === props.user?.id} isPublisher={isPublisher}
        isLibraryUser={!!props.user?.library}
        isPaidEducator={props.user?.subscriptionState === SubscriptionState.PaidTeacher} isCompetition={!!props.activeCompetition}
        onClick={() => {
          if (props.user) {
            startBrick();
          } if (onlyLibrary) {
            setUnauthorizedV2(true);
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
            <h1 dangerouslySetInnerHTML={{ __html: brick.title }} />
          </div>
          <CoverAuthorRow brick={brick} onlyLibrary={onlyLibrary} setLibraryLogin={() => setUnauthorizedV2(true)} />
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
              <span>{brick.subject?.name}{brick.alternateSubject ? ` - ${brick.alternateSubject.name}` : ''}, Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}</span>
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
          competitionId={props.competitionId}
          close={() => {
            setUnauthorizedV2(false);
          }}
          notyet={() => {
            if (playClicked) {
              startBrick()
            } else {
              setUnauthorizedV2(false);
            }
            setUnauthPopupShown(true);
          }}
          registered={() => {
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
          <CoverBioDialog isOpen={editorBioOpen} onlyLibrary={onlyLibrary} user={brick.editors[0] as any} close={() => setEditorBio(false)} />
        }
        {props.canSeeCompetitionDialog && competitionData &&
          <CompetitionDialog
            isOpen={competitionData.isOpen}
            onClose={() => setCompetitionData({ ...competitionData, isOpen: false })}
            onSubmit={() => {
              props.setCompetitionId(competitionData.competition.id);
              setCompetitionData({ ...competitionData, isOpen: false });
              startBrick();
            }}
          />
        }
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
                <h1
                  className="brick-title q-brick-title dynamic-title"
                  dangerouslySetInnerHTML={{ __html: brick.title }}
                />
                <CoverAuthorRow brick={brick} onlyLibrary={onlyLibrary} setLibraryLogin={() => setUnauthorizedV2(true)} />
                <div className="image-container centered">
                  <CoverImage
                    locked={!isPublisher && ((brick.isCore ?? false) || brick.author.id !== props.user?.id)}
                    brickId={brick.id}
                    data={{ value: brick.coverImage, imageSource: brick.coverImageSource, imageCaption: brick.coverImageCaption, imagePermision: false }}
                  />
                  <div className="cover-info-row">
                    {renderBrickCircle()}
                    <div className="subject-and-name">
                      {brick.subject?.name}{brick.alternateSubject ? ` - ${brick.alternateSubject.name}` : ''},
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
                    <KeyWordsPreview keywords={brick.keywords} onClick={keyword => {
                      if (onlyLibrary && !props.user) {
                        setUnauthorizedV2(true);
                      } else {
                        props.history.push('/play/dashboard?mySubject=true&searchString=' + keyword.name)
                      }
                    }} />
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
                  {/* <div dangerouslySetInnerHTML={{ __html: brick.brief}} /> */}
                  <MathInHtml value={brick.brief} />
                </div>
                {renderCoverPlay()}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <UnauthorizedUserDialogV2
        history={props.history}
        brick={brick}
        competitionId={props.competitionId}
        isOpen={unauthorizedOpenV2}
        close={() => {
          setUnauthorizedV2(false);
        }}
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
        <CompetitionDialog
          isOpen={competitionData.isOpen}
          onClose={() => setCompetitionData({ ...competitionData, isOpen: false })}
          onSubmit={() => {
            props.setCompetitionId(competitionData.competition.id);
            setCompetitionData({ ...competitionData, isOpen: false });
          }}
        />
      }
    </React.Suspense>
  );
};

export default CoverPage;
