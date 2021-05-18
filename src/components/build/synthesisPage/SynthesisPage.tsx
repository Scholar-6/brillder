import React from 'react'

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
import { stripHtml } from '../questionService/ConvertService';


export interface SynthesisProps {
  currentBrick: Brick;
  locked: boolean;
  editOnly: boolean;
  synthesis: string;
  undoRedoService: UndoRedoService;
  validationRequired: boolean;
  initSuggestionExpanded: boolean;
  onSynthesisChange(text: string): void;
  undo(): void;
  redo(): void;
}

interface SynthesisState {
  isLoaded: boolean;
  synthesis: string;
  scrollArea: any;
  canScroll: boolean;
  ref: React.RefObject<HTMLDivElement>;
  commentsShown: boolean;
}

class SynthesisPage extends React.Component<SynthesisProps, SynthesisState> {
  constructor(props: SynthesisProps) {
    super(props);
    this.state = {
      isLoaded: false,
      synthesis: props.synthesis,
      canScroll: false,
      scrollArea: null,
      ref: React.createRef() as React.RefObject<HTMLDivElement>,
      commentsShown: props.initSuggestionExpanded
    }
    this.setLoaded();
  }

  setLoaded () {
    setTimeout(() => {
      this.setState({isLoaded: true});
    }, 500);
  }

  componentDidMount() {
    const interval = setInterval(() => {
      try {
        let {current} = this.state.ref;
        if (current) {
          let scrollArea = current.getElementsByClassName("ql-editor")[0];
          let canScroll = false;
          if (scrollArea.scrollHeight > scrollArea.clientHeight) {
            canScroll = true;
          }

          this.setState({scrollArea, canScroll});
          clearInterval(interval);
        }
      } catch {}
    }, 100);
  }

  scrollUp() {
    const {scrollArea} = this.state;
    if (scrollArea) {
      scrollArea.scrollBy(0, -100);
    }
  }

  scrollDown() {
    const {scrollArea} = this.state;
    if (scrollArea) {
      scrollArea.scrollBy(0, 100);
    }
  }

  setCommentsShown(commentsShown: boolean) {
    this.setState({ ...this.state, commentsShown })
  }

  componentDidUpdate(prevProps: SynthesisProps) {
    if (prevProps.synthesis !== this.props.synthesis) {
      this.setState({ ...this.state, synthesis: this.props.synthesis });
    }
  }

  onSynthesisChange(text: string) {
    const {scrollArea} = this.state;
    if(scrollArea) {
      let canScroll = false;
      if (scrollArea.scrollHeight > scrollArea.clientHeight) {
        canScroll = true;
      }

      this.setState({ synthesis: text, canScroll });
    }
    this.props.onSynthesisChange(text);
  }

  render() {
    const {canScroll} = this.state;

    if (!this.state.isLoaded) {
      return <div />
    }

    return (
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
                data={this.state.synthesis}
                onChange={this.onSynthesisChange.bind(this)}
                showToolbar={true}
                allowTables={true}
                validate={this.props.validationRequired}
                isValid={!!stripHtml(this.state.synthesis)}
                toolbar={[
                  'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
                  'latex', 'bulletedList', 'numberedList', "align", 'blockQuote', "image", "table"
                ]}
                imageDialog={true}
              />
            </Grid>
            { !this.state.commentsShown &&
              <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="flex-end">
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
                  <div style={{width: "100%"}}>
                    <CountSynthesis value={this.state.synthesis} />
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
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick
});

const connector = connect(mapState);

export default connector(SynthesisPage);
