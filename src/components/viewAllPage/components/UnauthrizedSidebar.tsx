import React from "react";

import LabelTyping from "components/baseComponents/LabelTyping";

interface Props {}

const UnauthorizedSidebar: React.FC<Props> = (props) => {
  let [animate, setAnimate] = React.useState({
    secondStarted: false,
    thirdStarted: false
  });

  return (
    <div className="unauthorized-sidebar">
      <LabelTyping
        value="Discover bricks."
        className="bold title"
        start={true}
        onFinish={() => setAnimate({...animate, secondStarted: true })}
      />
      <LabelTyping
        value="Click on a subject that interests you and begin a"
        start={animate.secondStarted}
        className="m-t-3 text"
        onFinish={() => setAnimate({...animate, thirdStarted: true })}
      />
      <LabelTyping
        value="revolutionary interactive learning experience."
        className="text"
        start={animate.thirdStarted}
      />
    </div>
  );
};

export default UnauthorizedSidebar;
