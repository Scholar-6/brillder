import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import PlayGreenButton from "components/build/baseComponents/PlayGreenButton";

interface OverallPageProps {
  onClick(): void;
}

const OverallPage: React.FC<OverallPageProps> = (props) => {
  const [hovered, setHover] = React.useState(false);
  return (
    <div className="page2" onClick={props.onClick}>
      <div className="normal-page">
        <div className="normal-page-container">
          <div className="green-button-container1">
            <div className="green-button-container2">
              <div
                className="green-button-container3"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={
                  () => {}
                  //this.props.history.push(
                  //  routes.playAssignment(brick.id, this.state.attempts[this.state.activeAttemptIndex].assignmentId)
                  // )
                }
              >
                <div
                  className={`custom-hover-container ${
                    hovered ? "hovered" : ""
                  }`}
                ></div>
                <PlayGreenButton onClick={() => {}} />
              </div>
            </div>
            <div className="play-text">Play Again</div>
          </div>
          <div className="bottom-button">
            View Questions
            <SpriteIcon name="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallPage;
