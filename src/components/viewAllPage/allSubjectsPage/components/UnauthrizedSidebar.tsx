import React from "react";

import LabelTyping from "components/baseComponents/LabelTyping";
import { Grid } from "@material-ui/core";

interface Props { }

const UnauthorizedSidebar: React.FC<Props> = (props) => {
  let [animate, setAnimate] = React.useState({
    secondStarted: false,
    thirdStarted: false
  });

  return (
    <Grid container item xs={3} className="sort-and-filter-container">
      <div className="unauthorized-sidebar">
        <LabelTyping
          value="Discover bricks."
          className="bold title"
          start={true}
          onFinish={() => setAnimate({ ...animate, secondStarted: true })}
        />
        <LabelTyping
          value="Click on a subject that interests you and begin a"
          start={animate.secondStarted}
          className="m-t-3 text"
          onFinish={() => setAnimate({ ...animate, thirdStarted: true })}
        />
        <LabelTyping
          value="revolutionary interactive learning experience."
          className="text"
          start={animate.thirdStarted}
        />
      </div>
    </Grid>
  );
};

export default UnauthorizedSidebar;
