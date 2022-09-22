import React from "react";
import PublishToggle from "./PublishToggle";

interface Props {
  isPublish: boolean;
  published: number;
  switchPublish(): void;
}

const EmptyPage:React.FC<Props> = (props) => {
  const renderFirstEmptyColumn = () => {
    return (
      <div className="main-brick-container empty-description first" key={-12}>
        <div>
          <div className="centered">
            <div className="circle b-red"></div>
          </div>
          <div className="bold empty-title">Bricks in this column are draft bricks.</div>
          <div className="italic">
            They will appear here once you have begun a
            plan, or when an editor has reviewed and
            returned your brick to you.
          </div>
        </div>
      </div>
    );
  }

  const renderSecondEmptyColumn = () => {
    return (
      <div className="main-brick-container empty-description second" key={-3}>
        <div>
          <div className="centered">
            <div className="circle b-yellow"></div>
          </div>
          <div className="bold empty-title">Bricks in this column are with editors.</div>
          <div className="italic">
            They will appear here once you have played a
            preview of your brick and invited an editor to
            suggest changes to it.
          </div>
        </div>
      </div>
    );
  }

  const renderThirdEmptyColumn = () => {
    return (
      <div className="main-brick-container empty-description third" key={-4}>
        <div>
          <div className="centered">
            <div className="circle yellow-in-green centered">
              <div className="circle b-white"></div>
            </div>
          </div>
          <div className="bold empty-title">Bricks in this column are with publishers.</div>
          <div className="italic">
            They will appear here once your editor(s) approve(s) your brick and sends it to the Publisher.
          </div>
          <div className="last-text italic">
            You will receive a notification if your brick is published, and it will appear in the Public Library.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bricks-list-container no-top-padding">
      <PublishToggle
        isPublish={props.isPublish}
        publishedCount={props.published}
        onSwitch={props.switchPublish}
      />
      <div className="bricks-list">
        {renderFirstEmptyColumn()}
        {renderSecondEmptyColumn()}
        {renderThirdEmptyColumn()}
      </div>
    </div>
  );
}

export default EmptyPage;