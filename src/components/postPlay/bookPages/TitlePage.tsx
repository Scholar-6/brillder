import React from "react";

import { Brick } from "model/brick";
import { Grid } from "@material-ui/core";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import BrickTitle from "components/baseComponents/BrickTitle";

interface TitlePageProps {
  brick: Brick;
  color: string;
}

const TitlePage: React.FC<TitlePageProps> = ({brick, color}) => {
  return (
    <div className="page1">
      <div className="flipped-page">
        <Grid container justify="center">
          <div className="circle-icon" style={{ background: color }} />
        </Grid>
        <div className="proposal-titles">
          <div className="title">
            <BrickTitle title={brick.title} />
          </div>
          <KeyWordsPreview keywords={brick.keywords} />
        </div>
      </div>
    </div>
  );
}

export default TitlePage;
