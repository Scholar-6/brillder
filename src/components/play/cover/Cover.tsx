import React from "react";
import { Grid } from "@material-ui/core";

import { AcademicLevelLabels, Brick } from "model/brick";

import Image from "./Image";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { User } from "model/user";
import { checkPublisher } from "components/services/brickService";
import { setBrickCover } from "services/axios/brick";
import { ImageCoverData } from "./model";
import { isPhone } from "services/phone";

interface IntroductionProps {
  user: User;
  brick: Brick;
  location: any;
  history: any;
  moveNext(): void;
}

const IntroductionPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        startBrick();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  const startBrick = () => {
    props.moveNext();
  };

  const updateCover = async (coverData: ImageCoverData) => {
    const res = await setBrickCover({
      brickId: brick.id,
      coverImage: coverData.value,
      coverImageSource: coverData.imageSource,
      coverImageCaption: coverData.imageCaption
    });
    if (res) {
      // success
    } else {
      // fail
    }
  }

  const renderPlayButton = () => {
    return (
      <div>
        <div className="bolder">Are you ready to learn?</div>
        <div className="c-next-btn-container">
          <button type="button" className="bolder" onClick={startBrick}>
            Play Now
          </button>
        </div>
      </div>
    );
  };

  const renderFirstRow = () => {
    return (
      <div className="first-row">
        <div className="brick-id-container">Brick #{brick.id}</div>
        <div className="question">What is a brick?</div>
        <div className="hover-area">
          <SpriteIcon name="help-circle-custom" />
          <div className="hover-content">
            <div>A brick is a learning unit that should take either 20, 40, or 60 minutes to complete.</div>
            <div>Bricks follow a cognitively optimised sequence:</div>
            <div className="container">
              <div className="white-circle">1</div>
              <div className="l-text">
                Preparation: stimulus content gets you in the zone.
              </div>
            </div>
            <div className="container">
              <div className="white-circle">2</div>
              <div className="l-text">
                Investigation: challenging interactive questions make you think.
              </div>
            </div>
            <div className="container">
              <div className="white-circle">3</div>
              <div className="l-text">
                A preliminary score
              </div>
            </div>
            <div className="container">
              <div className="white-circle">4</div>
              <div className="l-text">
                Synthesis: explanation.
              </div>
            </div>
            <div className="container">
              <div className="white-circle">5</div>
              <div className="l-text">
                Review: hints help you correct your answers.
              </div>
            </div>
            <div className="container">
              <div className="white-circle">6</div>
              <div className="l-text">
                A final score
              </div>
            </div>
          </div>
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
      <div className="cover-page">
        {renderFirstRow()}
        <div className="brick-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
        <div className="author-row">{brick.author.firstName} {brick.author.lastName}</div>
        <div className="keywords-row">
          <KeyWordsPreview keywords={brick.keywords} />
        </div>
        <div className="image-container centered">
          <Image
            locked={!isPublisher}
            index={0}
            data={{ value: brick.coverImage, imageSource: brick.coverImageSource, imageCaption: brick.coverImageCaption, imagePermision: false }}
            save={updateCover}
            onFocus={() => { }}
          />
          <div className="cover-info-row">
            {renderBrickCircle()}
            {brick.subject?.name}, Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
            <SpriteIcon name="help-circle-custom" />
          </div>
        </div>
        <div className="introduction-info">
          {renderPlayButton()}
        </div>
      </div>
    );
  }

  return (
    <div className="brick-row-container cover-page">
      <div className="brick-container">
        <Grid container direction="row">
          <Grid item sm={8} xs={12}>
            <div className="introduction-page">
              {renderFirstRow()}
              <div className="brick-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
              <div className="author-row">{brick.author.firstName} {brick.author.lastName}</div>
              <div className="keywords-row">
                <KeyWordsPreview keywords={brick.keywords} />
              </div>
              <div className="image-container centered">
                <Image
                  locked={!isPublisher}
                  index={0}
                  data={{ value: brick.coverImage, imageSource: brick.coverImageSource, imageCaption: brick.coverImageCaption, imagePermision: false }}
                  save={updateCover}
                  onFocus={() => { }}
                />
                <div className="cover-info-row">
                  {renderBrickCircle()}
                  {brick.subject?.name},
                  Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
                  <div className="hover-area">
                    <SpriteIcon name="help-circle-custom" />
                    <div className="hover-content">
                      <div>Brillder focusses on universal concepts and topics, not specific exam courses.</div>
                      <br/>
                      <div>LEVELS:</div>
                      <div className="container">
                        <div className="white-circle">1</div>
                        <div className="l-text">
                          <div>I Foundation</div>
                          <div>For 15-16 yr-olds, equivalent to GCSE / IB Middle Years / High School Diploma</div>
                        </div>
                      </div>
                      <br/>
                      <div className="container">
                        <div className="white-circle">2</div>
                        <div className="l-text">
                          <div>II & III Core</div>
                          <div>For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                        </div>
                      </div>
                      <br/>
                      <div className="container">
                        <div className="white-circle">3</div>
                        <div className="l-text">
                          <div>IV Extension</div>
                          <div>College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) students</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item sm={4} xs={12}>
            <div className="introduction-info">
              {renderPlayButton()}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default IntroductionPage;
