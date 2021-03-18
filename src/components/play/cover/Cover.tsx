import React from "react";
import { Grid } from "@material-ui/core";

import DynamicFont from 'react-dynamic-font';

import { Brick } from "model/brick";

import Image from "./Image";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { User } from "model/user";
import { checkPublisher } from "components/services/brickService";

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

  const isPublisher = false;
  if (props.user) {
    checkPublisher(props.user, brick);
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
              <div className="centered">
                <Image
                  locked={!isPublisher}
                  index={0}
                  data={{
                    value: '',
                    imageAlign: 1,
                    imageHeight: 40
                  }}
                  validationRequired={false}
                  save={() => { }}
                  updateComponent={() => { }}
                  onFocus={() => { }}
                />
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
