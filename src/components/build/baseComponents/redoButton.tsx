import React from "react";
import * as Y from "yjs";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { YJSContext } from "./YJSProvider";

export interface ButtonProps {
  undoManager?: Y.UndoManager;
}

const RedoButton: React.FC<ButtonProps> = ({ undoManager }) => {
  const [hovered, setHover] = React.useState(false);
  const [enabled, setEnabled] = React.useState((undoManager?.redoStack.length ?? 0) > 0);

  const observer = React.useCallback(() => {
    setEnabled((undoManager?.redoStack.length ?? 0) > 0);
  }, [undoManager]);

  React.useEffect(() => {
    observer();
    undoManager?.on("stack-item-added", observer);
    undoManager?.on("stack-item-popped", observer);
    return () => {
      undoManager?.off("stack-item-added", observer);
      undoManager?.off("stack-item-popped", observer);
    };
  }, [undoManager, observer]);

  return (
    <div className="redo-button-container">
      <button
        className="btn btn-transparent svgOnHover redo-button"
        onMouseLeave={() => setHover(false)}
        onMouseEnter={()=> setHover(true)}
        onClick={undoManager?.redo.bind(undoManager) ?? (() => {})}
      >
        <SpriteIcon
          name="redo"
          className={`w100 h100 active ${enabled && "text-theme-orange"}`}
        />
      </button>
      {hovered && <div className="custom-tooltip">Redo</div>}
    </div>
  );
};

export default RedoButton;
