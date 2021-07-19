import React from "react";
import { Brick } from "model/brick";

interface Props {
  brick: Brick;
  moveNext(): void;
}

const PreInvestigationPage: React.FC<Props> = ({ brick, moveNext }) => {
  return (
    <div className="pre-investigation">
      <div
        className="fixed-upper-b-title"
        dangerouslySetInnerHTML={{ __html: brick.title }}
      />
      <div className="introduction-page">
        <div className="ss-phone-before-title" />
        <div className="dd-question-container">
          <div className="dd-first">?</div>
          <div className="dd-second">?</div>
          <div className="dd-third">?</div>
        </div>
        <div className="title s-fade1">
          <div>Time for some questions.</div>
        </div>
        <div className="ss-phone-after-title" />
        <div className="like-button animate-v1">Preparation</div>
        <div className="ss-phone-between-button" />
        <div className="like-button orange" onClick={moveNext}>
          Investigation
        </div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Synthesis</div>
        <div className="ss-phone-between-button" />
        <div className="like-button animate-v1">Review</div>
      </div>
    </div>
  );
};

export default PreInvestigationPage;
