import React from "react";
import { Grid } from "@material-ui/core";

import DynamicFont from 'react-dynamic-font';

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

interface IntroductionProps {
  user: User;
  brick: Brick;
  location: any;
  history: any;
  moveNext(): void;
}

const IntroductionPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const [removed, setRemoved] = React.useState(true as boolean | null);
  const [file, setFile] = React.useState(null as File | null);
  const [cropedFile, setCroped] = React.useState(file as File | null);

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
        <div className="font-black">Are you ready to learn?</div>
        <div className="c-next-btn-container">
          <button type="button" className="font-black" onClick={startBrick}>
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
        <SpriteIcon name="help-circle-custom" />
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

  return (
    <div className="brick-row-container cover-page">
      <div className="brick-container">
        <Grid container direction="row">
          <Grid item sm={8} xs={12}>
            <div className="introduction-page">
              {renderFirstRow()}
              <div className="brick-title"><DynamicFont content={brick.title} /></div>
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
                  Religion & Philosophy,
                  Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
                  <SpriteIcon name="help-circle-custom" />
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
