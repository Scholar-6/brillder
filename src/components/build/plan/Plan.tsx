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
import DifficultySelectObservable from "./DifficultySelectObservable";
import { toRenderJSON } from "services/SharedTypeService";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import PlanPreviewComponent from "../baseComponents/phonePreview/plan/PlanPreview";
import BrickLengthObservable from "./BrickLengthObservable";

export interface PlanProps {
  currentBrick: Brick;
  user: User;
  ybrick: Y.Map<any>;
  locked: boolean;
  editOnly: boolean;
  undoRedoService: UndoRedoService;
  initSuggestionExpanded?: boolean;
  selectFirstQuestion(): void;
  undo(): void;
  redo(): void;
}

const PlanPage: React.FC<PlanProps> = (props) => {
  const { subjects } = props.user;
  const { ybrick, locked } = props;

  const [scrollArea] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const [canScroll, setScroll] = React.useState(false);

  const [commentsShown, setCommentsShown] = React.useState(false);
  const editorIdState = React.useState("");
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  React.useEffect(() => {
    const subjectId = ybrick.get("subjectId");
    if (subjects) {
      setSubjectIndex(subjects.findIndex((s) => s.id === subjectId) ?? 0);
    }
    setTimeout(() => {
      let { current } = scrollArea;
      if (current) {
        console.log(current.scrollHeight, current.clientHeight);
        if (current.scrollHeight > current.clientHeight) {
          if (!canScroll) {
            setScroll(true);
          }
        } else {
          if (canScroll) {
            setScroll(false);
          }
        }
      }
    }, 100);
    /*eslint-disable-next-line*/
  }, [subjects]);

  React.useEffect(() => {
    setTimeout(() => {
      let { current } = scrollArea;
      if (current) {
        console.log(current.scrollHeight, current.clientHeight);
        if (current.scrollHeight > current.clientHeight) {
          if (!canScroll) {
            setScroll(true);
          }
        } else {
          if (canScroll) {
            setScroll(false);
          }
        }
      }
    }, 100);
  }, [canScroll, scrollArea, props, setScroll]);

  const scrollUp = () => {
    const { current } = scrollArea;
    if (current) {
      current.scrollBy(0, -window.screen.height / 30);
    }
  }

  const scrollDown = () => {
    const { current } = scrollArea;
    if (current) {
      current.scrollBy(0, window.screen.height / 30);
    }
  }

  const title = ybrick.get("title");
  if (typeof title === "string") {
    ybrick.set("title", new Y.Text(title));
    return <div />;
  }

  return (
    <div className="question-type plan-page">
      <div className="top-scroll-area">
        <div className="top-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollUp}>
            <SpriteIcon
              name="arrow-up"
              className={`active text-theme-orange ${!canScroll && 'disabled'}`}
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
                <Grid container direction="row" className="inner-quills" ref={scrollArea}>
                  <div className="title-quill-container">
                    <QuillEditor
                      sharedData={title}
                      placeholder="Title"
                      disabled={locked}
                      toolbar={[]}
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
                        onChange={(evt) => {
                          ybrick.set("subjectId", subjects[evt.target.value as number].id as number);
                          setSubjectIndex(evt.target.value as number);
                        }}
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
                    <DifficultySelectObservable
                      disabled={locked}
                      ybrick={ybrick}
                    />
                    <BrickLengthObservable disabled={locked} ybrick={ybrick} />
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
                    location={CommentLocation.Prep}
                    setCommentsShown={setCommentsShown}
                  />
                </div>
                <div style={{ width: "100%" }}></div>
              </div>
            </Grid>
          )}
          <Grid className={`plan-comments-panel ${!commentsShown && "hidden"}`} item>
            <CommentPanel
              currentLocation={CommentLocation.Prep}
              currentBrick={toRenderJSON(ybrick) as Brick}
              setCommentsShown={setCommentsShown}
              haveBackButton={true}
            />
          </Grid>
        </Grid>
      </div>
      <div className="bottom-scroll-area">
        <div className="bottom-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollDown}>
            <SpriteIcon
              name="arrow-down"
              className={`active text-theme-orange ${!canScroll && 'disabled'}`}
            />
          </button>
        </div>
      </div>
      <div className="fixed-build-phone">
        <PhonePreview
          Component={PlanPreviewComponent}
          prev={() => { }}
          next={props.selectFirstQuestion}
          prevDisabled={true}
          data={{ ybrick, user: props.user }}
        />
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick,
});

const connector = connect(mapState);

export default connector(React.memo(PlanPage));
