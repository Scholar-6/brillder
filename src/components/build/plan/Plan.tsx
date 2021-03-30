import React from "react";
import * as Y from "yjs";
import { connect } from "react-redux";
import {
  Grid,
  InputBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SvgIcon,
} from "@material-ui/core";

import CommentPanel from "components/baseComponents/comments/CommentPanel";
import { CommentLocation } from "model/comments";
import { ReduxCombinedState } from "redux/reducers";

import { AcademicLevel, Brick, BrickLengthEnum } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CommentButton from "../baseComponents/commentButton/CommentButton";
import UndoRedoService from "components/services/UndoRedoService";
import RedoButton from "../baseComponents/redoButton";
import UndoButton from "../baseComponents/UndoButton";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { QuillEditorContext } from "components/baseComponents/quill/QuillEditorContext";
import QuillGlobalToolbar from "components/baseComponents/quill/QuillGlobalToolbar";
import KeyWordsComponent from "../proposal/questionnaire/brickTitle/KeyWords";
import { User } from "model/user";
import DifficultySelect from "../proposal/questionnaire/brickTitle/DifficultySelect";
import { toRenderJSON } from "services/SharedTypeService";

export interface PlanProps {
  currentBrick: Brick;
  user: User;
  ybrick: Y.Map<any>;
  locked: boolean;
  editOnly: boolean;
  undoRedoService: UndoRedoService;
  initSuggestionExpanded: boolean;
  undo(): void;
  redo(): void;
}

const PlanPage: React.FC<PlanProps> = (props) => {
  const { subjects } = props.user;
  const { ybrick, locked } = props;
  const [commentsShown, setCommentsShown] = React.useState(false);
  const editorIdState = React.useState("");
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  React.useEffect(() => {
    const subjectId = ybrick.get("subjectId");
    if (subjects) {
      setSubjectIndex(subjects.findIndex((s) => s.id === subjectId) ?? 0);
    }
  }, [subjects]);

  return (
    <div className="question-type plan-page">
      <div className="top-scroll-area">
        <div className="top-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={() => { }}>
            <SpriteIcon
              name="arrow-up"
              className={`active text-theme-orange`}
            />
          </button>
        </div>
      </div>
      <div className="inner-question-type">
        <Grid
          container
          direction="row"
          alignItems="stretch"
          style={{ height: "100%" }}
        >
          <Grid item xs className="plan-quill-container">
            <QuillEditorContext.Provider value={editorIdState}>
              <div className="p-edit-container">
                <QuillGlobalToolbar
                  disabled={locked}
                  availableOptions={[
                    "bold",
                    "italic",
                    "fontColor",
                    "superscript",
                    "subscript",
                    "strikethrough",
                    "latex",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "image",
                  ]}
                />
                <Grid container direction="row" className="inner-quills">
                  <div className="title-quill-container">
                    <input
                      value={ybrick.get("title")}
                      placeholder="Title"
                      disabled={locked}
                      onChange={(e) => ybrick.set("title", e.target.value)}
                    />
                  </div>
                  <KeyWordsComponent
                    disabled={locked}
                    keyWords={ybrick.get("keywords")}
                  />
                  <div className="subject-select-container">
                    {subjectIndex !== undefined && (
                      <Select
                        value={subjectIndex}
                        onChange={(evt) =>
                          setSubjectIndex(evt.target.value as number)
                        }
                        input={<InputBase />}
                      >
                        {subjects?.map((s, i) => (
                          <MenuItem value={i} key={i}>
                            <ListItemIcon>
                              <SvgIcon>
                                <SpriteIcon
                                  name="circle-filled"
                                  className="w100 h100 active"
                                  style={{ color: s.color }}
                                />
                              </SvgIcon>
                            </ListItemIcon>
                            <ListItemText>{s.name}</ListItemText>
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </div>
                  <div className="level-and-length-container">
                    <DifficultySelect
                      disabled={locked}
                      level={ybrick.get("academicLevel")}
                      onChange={(academicLevel) =>
                        ybrick.set("academicLevel", academicLevel)
                      }
                    />
                    <Select
                      className="brick-length"
                      value={ybrick.get("brickLength")}
                    >
                      <MenuItem value={BrickLengthEnum.S20min}>
                        20 mins
                      </MenuItem>
                      <MenuItem value={BrickLengthEnum.S40min}>
                        40 mins
                      </MenuItem>
                      <MenuItem value={BrickLengthEnum.S60min}>
                        60 mins
                      </MenuItem>
                    </Select>
                  </div>
                  <div className="open-question-container">
                    <QuillEditor
                      disabled={locked}
                      sharedData={ybrick.get("openQuestion")}
                      toolbar={["bold", "italic", "latex"]}
                      imageDialog={true}
                    />
                  </div>
                  <div className="brief-container">
                    <div className="header">Brief</div>
                    <QuillEditor
                      disabled={locked}
                      sharedData={ybrick.get("brief")}
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "bulletedList",
                        "numberedList",
                      ]}
                      imageDialog={true}
                    />
                  </div>
                  <div className="prep-container">
                    <div className="header">Prep</div>
                    <QuillEditor
                      disabled={locked}
                      sharedData={ybrick.get("prep")}
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "image",
                      ]}
                      imageDialog={true}
                    />
                  </div>
                </Grid>
              </div>
            </QuillEditorContext.Provider>
          </Grid>
          {!commentsShown && (
            <Grid
              container
              item
              xs={3}
              sm={3}
              md={3}
              direction="column"
              className="right-sidebar"
              alignItems="flex-end"
            >
              <div className="comments-sidebar-default">
                <div className="reundo-button-container">
                  <UndoButton
                    undo={props.undo}
                    canUndo={() => false}
                  />
                  <RedoButton
                    redo={props.redo}
                    canRedo={() => false}
                  />
                </div>
                <div className="comment-button-container">
                  <CommentButton
                    location={CommentLocation.Synthesis}
                    setCommentsShown={setCommentsShown}
                  />
                </div>
                <div style={{ width: "100%" }}></div>
              </div>
            </Grid>
          )}
          <Grid className={`plan-comments-panel ${!commentsShown && "hidden"}`} item>
            <CommentPanel
              currentLocation={CommentLocation.Synthesis}
              currentBrick={toRenderJSON(ybrick) as Brick}
              setCommentsShown={setCommentsShown}
              haveBackButton={true}
            />
          </Grid>
        </Grid>
      </div>
      <div className="bottom-scroll-area">
        <div className="bottom-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={() => { }}>
            <SpriteIcon
              name="arrow-down"
              className={`active text-theme-orange`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick,
});

const connector = connect(mapState);

export default connector(React.memo(PlanPage));
