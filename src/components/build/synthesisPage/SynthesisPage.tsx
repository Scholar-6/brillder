import React from 'react';
import * as Y from "yjs";

import './SynthesisPage.scss';
import { Grid } from '@material-ui/core';
import CommentPanel from 'components/baseComponents/comments/CommentPanel';
import { CommentLocation } from "model/comments";
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { Brick } from 'model/brick';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import CommentButton from '../baseComponents/commentButton/CommentButton';
import UndoRedoService from 'components/services/UndoRedoService';
import RedoButton from '../baseComponents/redoButton';
import UndoButton from '../baseComponents/UndoButton';
import CountSynthesis from './WordsCount';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import { QuillEditorContext } from 'components/baseComponents/quill/QuillEditorContext';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import SynthesisPreviewComponent from "../baseComponents/phonePreview/synthesis/SynthesisPreview";


export interface SynthesisProps {
  currentBrick: Brick;
  ybrick: Y.Map<any>;
  undoManager?: Y.UndoManager;
  locked: boolean;
  editOnly: boolean;
  initSuggestionExpanded: boolean;
  moveToLastQuestion(): void;
}

interface SynthesisState {
  scrollArea: any;
  canScroll: boolean;
  ref: React.RefObject<HTMLDivElement>;
  currentEditorId: string;
  commentsShown: boolean;
}

class SynthesisPage extends React.Component<SynthesisProps, SynthesisState> {
  constructor(props: SynthesisProps) {
    super(props);
    this.state = {
      canScroll: false,
      scrollArea: null,
      ref: React.createRef() as React.RefObject<HTMLDivElement>,
      currentEditorId: "",
      commentsShown: props.initSuggestionExpanded
    }
  }

  componentDidMount() {
    const interval = setInterval(() => {
      try {
        let { current } = this.state.ref;
        if (current) {
          let scrollArea = current.getElementsByClassName("ql-editor")[0];
          let canScroll = false;
          if (scrollArea.scrollHeight > scrollArea.clientHeight) {
            canScroll = true;
          }

          this.setState({ scrollArea, canScroll });
          clearInterval(interval);
        }
      } catch { }
    }, 100);
  }

  scrollUp() {
    const { scrollArea } = this.state;
    if (scrollArea) {
      scrollArea.scrollBy(0, -100);
    }
  }

  scrollDown() {
    const { scrollArea } = this.state;
    if (scrollArea) {
      scrollArea.scrollBy(0, 100);
    }
  }

  setCommentsShown(commentsShown: boolean) {
    this.setState({ ...this.state, commentsShown })
  }

  onSynthesisChange(text: string) {
    const { scrollArea } = this.state;
    if (scrollArea) {
      let canScroll = false;
      if (scrollArea.scrollHeight > scrollArea.clientHeight) {
        canScroll = true;
      }

      this.setState({ canScroll });
    }
  }

  render() {
    const { canScroll } = this.state;
    const synthesis = this.props.ybrick.get("synthesis") as Y.Text;

    return (
      <QuillEditorContext.Provider value={[this.state.currentEditorId, (editorId: string) => this.setState(state => ({ ...state, currentEditorId: editorId }))]}>
        <div className="question-type synthesis-page">
          <div className="top-scroll-area">
            <div className="top-button-container">
              <button className="btn btn-transparent svgOnHover" onClick={this.scrollUp.bind(this)}>
                <SpriteIcon name="arrow-up" className={`active text-theme-orange ${!canScroll && 'disabled'}`} />
              </button>
            </div>
          </div>
          <div className="inner-question-type" ref={this.state.ref}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs className="synthesis-input-container">
                <QuillEditor
                  disabled={this.props.locked}
                  sharedData={synthesis}
                  showToolbar={true}
                  imageDialog={true}
                  toolbar={[
                    'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
                    'latex', 'bulletedList', 'numberedList', 'blockQuote', 'image'
                  ]}
                />
              </Grid>
              {!this.state.commentsShown &&
                <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="flex-end">
                  <div className="comments-sidebar-default">
                    <div className="reundo-button-container">
                      <UndoButton undoManager={this.props.undoManager} />
                      <RedoButton undoManager={this.props.undoManager} />
                    </div>
                    <div className="comment-button-container">
                      <CommentButton
                        location={CommentLocation.Synthesis}
                        setCommentsShown={this.setCommentsShown.bind(this)}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <CountSynthesis value={synthesis.toJSON()} />
                    </div>
                  </div>
                </Grid>
              }
              <Grid className={`synthesis-comments-panel ${!this.state.commentsShown && "hidden"}`} item>
                <CommentPanel
                  currentLocation={CommentLocation.Synthesis}
                  currentBrick={this.props.currentBrick}
                  setCommentsShown={this.setCommentsShown.bind(this)}
                  haveBackButton={true}
                />
              </Grid>
            </Grid>
          </div>
          <div className="bottom-scroll-area">
            <div className="bottom-button-container">
              <button className="btn btn-transparent svgOnHover" onClick={this.scrollDown.bind(this)}>
                <SpriteIcon name="arrow-down" className={`active text-theme-orange ${!canScroll && 'disabled'}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="fixed-build-phone">
          <PhonePreview
            Component={SynthesisPreviewComponent}
            prev={this.props.moveToLastQuestion}
            next={() => { }}
            nextDisabled={true}
            data={{ synthesis, brickLength: this.props.ybrick.get("brickLength") }}
          />
        </div>
      </QuillEditorContext.Provider>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick
});

const connector = connect(mapState);

export default connector(React.memo(SynthesisPage));
