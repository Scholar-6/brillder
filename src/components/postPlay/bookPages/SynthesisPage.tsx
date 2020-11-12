import React from "react";
import { PlayMode } from "components/play/model";
import HighlightHtml from "components/play/baseComponents/HighlightHtml";

interface SynthesisPageProps {
  synthesis: string;
  onClick(): void;
}

const SynthesisPage: React.FC<SynthesisPageProps> = (props) => {
  return (
    <div className="book-page synthesis-page" onClick={props.onClick}>
      <div className="normal-page flipped-page">
        <div className="normal-page-container">
          <h2>Synthesis</h2>
          <HighlightHtml
            value={props.synthesis}
            mode={PlayMode.Normal}
            onHighlight={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default SynthesisPage;
