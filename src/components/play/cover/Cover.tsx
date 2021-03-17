import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import { Brick } from "model/brick";

import Image from "./Image";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/KeywordsPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useEffect } from "react";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";

interface IntroductionProps {
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
    if (isPhone()) {
    }
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

  return (
    <div className="brick-row-container cover-page">
      <div className="brick-container">
        <Grid container direction="row">
          <Grid item sm={8} xs={12}>
            <div className="introduction-page">
              {renderFirstRow()}
              <div className="brick-title">{brick.title}</div>
              <div className="author-row">{brick.author.firstName} {brick.author.lastName}</div>
              <div className="keywords-row">
                <KeyWordsPreview keywords={brick.keywords} />
              </div>
              <div className="centered">
                <Image
                  locked={false}
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
