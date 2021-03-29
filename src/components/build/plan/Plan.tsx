import React from "react";
import * as Y from "yjs";
import { connect } from "react-redux";
import { Grid, InputBase, ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';

import CommentPanel from "components/baseComponents/comments/CommentPanel";
import { CommentLocation } from "model/comments";
import { ReduxCombinedState } from "redux/reducers";

import { Brick } from "model/brick";
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
  const {subjects} = props.user;
  const { ybrick } = props;
  const editorIdState = React.useState("");
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  React.useEffect(() => {
    const subjectId = ybrick.get("subjectId");
    if(subjects) {
      setSubjectIndex(subjects.findIndex(s => s.id === subjectId) ?? 0);
    }
  }, [subjects])

  console.log(subjectIndex);

  return (
    <div className="question-type plan-page">
      <div className="top-scroll-area">
        <div className="top-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={() => {}}>
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
                  disabled={props.locked}
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
                      disabled={props.locked}
                      onChange={(e) => ybrick.set("title", e.target.value)}
                    />
                  </div>
                  <KeyWordsComponent
                    disabled={props.locked}
                    keyWords={ybrick.get("keywords")}
                  />
                  <div className="subject-select-container">    
                  {subjectIndex !== undefined &&
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
                    </Select>}
                  </div>
                  <div className="level-and-length-container">
                    
                  </div>
                </Grid>
              </div>
            </QuillEditorContext.Provider>
          </Grid>
          <Grid
            container
            item
            xs={3}
            sm={3}
            md={3}
            direction="column"
            className="right-sidebar"
            alignItems="flex-end"
          ></Grid>
          {/*
            {!this.state.commentsShown && (
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
                      undo={this.props.undo}
                      canUndo={() => this.props.undoRedoService.canUndo()}
                    />
                    <RedoButton
                      redo={this.props.redo}
                      canRedo={() => this.props.undoRedoService.canRedo()}
                    />
                  </div>
                  <div className="comment-button-container">
                    <CommentButton
                      location={CommentLocation.Synthesis}
                      setCommentsShown={this.setCommentsShown.bind(this)}
                    />
                  </div>
                  <div style={{ width: "100%" }}></div>
                </div>
              </Grid>
            )}
            <Grid
              className={`synthesis-comments-panel ${
                !this.state.commentsShown && "hidden"
              }`}
              item
            >
              <CommentPanel
                currentLocation={CommentLocation.Synthesis}
                currentBrick={this.props.currentBrick}
                setCommentsShown={this.setCommentsShown.bind(this)}
                haveBackButton={true}
              />
            </Grid>*/}
        </Grid>
      </div>
      {/*
        <div className="bottom-scroll-area">
          <div className="bottom-button-container">
            <button
              className="btn btn-transparent svgOnHover"
              onClick={() => {}}
            >
              <SpriteIcon
                name="arrow-down"
                className={`active text-theme-orange ${
                  !canScroll && "disabled"
                }`}
              />
            </button>
            </div>
        </div>*/}
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick,
});

const connector = connect(mapState);

export default connector(React.memo(PlanPage));
