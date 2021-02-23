import React from "react";
import * as Y from "yjs";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import { ReactSortable, Sortable } from "react-sortablejs";

import "./DragableTabs.scss";
import { validateQuestion } from "../questionService/ValidateQuestionService";
import DragTab from "./dragTab";
import PlusTab from "./plusTab";
import SynthesisTab from "./SynthesisTab";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { Comment, CommentLocation } from "model/comments";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import { User } from "model/user";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import { generateId } from "../buildQuestions/questionTypes/service/questionBuild";
import { toRenderJSON } from "services/SharedTypeService";

interface Question {
  id: number;
  active: boolean;
  type: number;
}

interface DragTabsProps {
  history: any;
  yquestions: Y.Array<Y.Doc>;
  currentQuestionIndex: number;
  user: User;
  comments: Comment[] | null;
  synthesis: string;
  isSynthesisPage: boolean;
  validationRequired: boolean;
  tutorialStep: TutorialStep;
  tutorialSkipped: boolean;
  openSkipTutorial(): void;
  createNewQuestion(): void;
  moveToSynthesis(): void;
  setQuestions(questions: any): void;
  selectQuestion(e: any): void;
  moveToLastQuestion(): void;
  removeQuestion(e: any): void;
}

interface TabsState {
  handleKey(e: any): void;
  sortableId: number;
}

class DragableTabs extends React.Component<DragTabsProps, TabsState> {
  constructor(props: DragTabsProps) {
    super(props);

    this.state = {
      handleKey: this.handleKey.bind(this),
      sortableId: generateId(),
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.tagName === "TEXTAREA") { return; }
    if (e.target.classList.contains("ck-content")) { return; }
    if (e.target.classList.contains("ql-editor")) { return; }

    const jsonQuestions = this.props.yquestions.toJSON() as Question[];

    if (leftKeyPressed(e)) {
      if (this.props.history.location.pathname.slice(-10).toLowerCase() === '/synthesis') {
        let keyIndex = jsonQuestions.length;
        this.props.selectQuestion(keyIndex - 1)
      } else {
        let keyIndex = jsonQuestions.findIndex(q => q.active === true);

        if (keyIndex > 0) {
          this.props.selectQuestion(keyIndex - 1)
        }
      }
    } else if (rightKeyPressed(e)) {
      let isSynthesisPage = false;
      if (this.props.history.location.pathname.slice(-10).toLowerCase() === '/synthesis') {
        isSynthesisPage = true;
      }
      
      if (!isSynthesisPage) {
        let keyIndex = jsonQuestions.findIndex(q => q.active === true);
  
        if (keyIndex < jsonQuestions.length - 1) { 
          this.props.selectQuestion(keyIndex + 1);
        } else {
          this.props.moveToSynthesis();
        }
      }
    }
  }

  render() {
    let isSynthesisPresent = true;
    const { props } = this;
    const { isSynthesisPage, synthesis, yquestions } = props;

    const getHasSynthesisReplied = () => {
      const replies = props.comments
        ?.filter((comment) => comment.location === CommentLocation.Synthesis)
        .map(getLatestChild)
        .sort(
          (a, b) =>
            new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
        );
      if (replies && replies.length > 0) {
        const latestAuthor = replies[0].author.id;
        const isCurrentUser = latestAuthor === props.user.id;
        return isCurrentUser ? 1 : -1;
      } else {
        return 0;
      }
    };

    const getHasReplied = (questionId: number) => {
      const replies = props.comments
        ?.filter((comment) => (comment.question?.id ?? -1) === questionId)
        .map(getLatestChild)
        .sort(
          (a, b) =>
            new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
        );
      if (replies && replies.length > 0) {
        const latestAuthor = replies[0].author.id;
        const isCurrentUser = latestAuthor === props.user.id;
        return isCurrentUser ? 1 : -1;
      } else {
        return 0;
      }
    };

    const getLatestChild = (comment: Comment) => {
      if (!comment.children || comment.children.length <= 0) {
        return comment;
      }
      const replies = comment.children.sort(
        (a, b) =>
          new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
      );
      return replies[0];
    };

    const renderQuestionTab = (
      yquestions: Y.Array<Y.Doc>,
      yquestion: Y.Doc,
      index: number,
      comlumns: number
    ) => {
      const question = toRenderJSON(yquestion.getMap());
      let titleClassNames = "drag-tile-container";
      let cols = 2;
      if (index === props.currentQuestionIndex) {
        titleClassNames += " active";
        cols = 3;
      }

      let nextQuestion = yquestions.get(index + 1)?.getMap();
      if (nextQuestion && nextQuestion.get("active")) {
        titleClassNames += " pre-active";
      }

      let width = (100 * 2) / (comlumns - 2);
      if (question.active) {
        width = (100 * 3) / (comlumns - 2);
      }

      if (isSynthesisPage) {
        width = (100 * 2) / (comlumns - 2);
      }

      let isValid = true;
      if (props.validationRequired) {
        isValid = validateQuestion(question as any);
      }

      return (
        <GridListTile
          className={titleClassNames}
          key={yquestion.guid}
          cols={cols}
          style={{ display: "inline-block", width: `${width}%` }}
        >
          <DragTab
            index={index}
            questionId={question.id}
            active={props.currentQuestionIndex === index}
            isValid={isValid}
            getHasReplied={getHasReplied}
            selectQuestion={props.selectQuestion}
            removeQuestion={props.removeQuestion}
          />
        </GridListTile>
      );
    };

    let columns = props.yquestions.length * 2 + 3;

    if (isSynthesisPage) {
      columns = props.yquestions.length * 2 + 2;
    }
    
    const onUpdateQuestions = (evt: Sortable.SortableEvent) => {
      if((evt.oldIndex ?? -1 >= 0) && (evt.newIndex ?? -1 >= 0)) {
        console.log(evt);
        yquestions.doc?.transact(() => {
          const question = yquestions.get(evt.oldIndex!);
          yquestions.delete(evt.oldIndex!);
          yquestions.insert(evt.newIndex!, [question]);
        });
        // WARNING: using same hacky solution as questionComponents.tsx
        this.setState({ ...this.state, sortableId: generateId() });
      }
    }

    const renderSynthesisTab = () => {
      let className = 'drag-tile-container';
      if (isSynthesisPage) {
        className += ' synthesis-tab active';
      }

      return (
        <GridListTile
          onClick={() => {
            if (props.tutorialSkipped) {
              props.moveToSynthesis();
            } else {
              props.openSkipTutorial();
            }
          }}
          className={className}
          cols={1.5555}
        >
          <SynthesisTab
            columns={columns}
            tutorialStep={props.tutorialStep}
            validationRequired={props.validationRequired}
            synthesis={synthesis}
            getHasReplied={getHasSynthesisReplied}
          />
        </GridListTile>
      );
    }

    return (
      <div
        className="drag-tabs"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          overflow: "hidden",
        }}
      >
        <GridList
          cellHeight={40}
          cols={columns}
          style={{
            width: "100%",
            flexWrap: "nowrap",
            margin: "0 !important",
            overflow: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <ReactSortable
            key={this.state.sortableId}
            list={props.yquestions.map((q: Y.Doc) => ({ id: q.guid }))}
            className="drag-container"
            group="tabs-group"
            onUpdate={onUpdateQuestions}
            setList={() => {}}
          >
            {props.yquestions.map((question: Y.Doc, i) =>
              renderQuestionTab(props.yquestions, question, i, columns)
            )}
          </ReactSortable>
          <GridListTile
            onClick={props.createNewQuestion}
            className={"drag-tile-container"}
            cols={isSynthesisPresent || isSynthesisPage ? 1.5555 : 2}
          >
            <PlusTab tutorialStep={props.tutorialStep} />
          </GridListTile>
          {(isSynthesisPresent || isSynthesisPage) && (
            renderSynthesisTab()
          )}
        </GridList>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  comments: state.comments.comments,
});

const connector = connect(mapState);

export default connector(DragableTabs);
