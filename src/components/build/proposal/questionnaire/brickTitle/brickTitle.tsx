import React, { Component } from "react";
import { Grid, Input, Hidden } from "@material-ui/core";

import './brickTitle.scss';
import { ProposalStep, PlayButtonStatus, OpenQuestionRoutePart } from "../../model";
import { Brick, Subject } from "model/brick";
import { getDate, getMonth, getYear } from 'components/services/brickService';
import { setBrillderTitle } from "components/services/titleService";
import { enterPressed } from "components/services/key";

import NextButton from '../../components/nextButton';
import PrevButton from "../../components/previousButton";
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';

import SpriteIcon from "components/baseComponents/SpriteIcon";

import a from 'indefinite';
import map from "components/map";
import { User } from "model/user";
import AddSubjectDialog from "./AddSubjectDialog";

enum RefName {
  subTitleRef = 'subTitleRef',
  altTitleRef = 'altTitleRef'
}

interface BrickTitleProps {
  user: User;
  history: any;
  baseUrl: string;
  parentState: Brick;
  canEdit: boolean;
  playStatus: PlayButtonStatus;
  subjects: Subject[];
  saveTitles(data: any): void;
  saveAndPreview(): void;
}

interface BrickTitleState {
  subjectSelectOpen: boolean;
  subTitleRef: React.RefObject<HTMLDivElement>;
  altTitleRef: React.RefObject<HTMLDivElement>;
}

const BrickTitlePreviewComponent: React.FC<any> = (props) => {
  let { subTopic, alternativeTopics, title, author } = props.data;

  const date = new Date();
  const dateString = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;

  const renderAuthorRow = () => {
    let data = "";
    if (author) {
      data = (author.firstName ? author.firstName + ' ' + author.lastName : 'Author') + ' | ' + dateString;
    } else {
      data = "Author | " + dateString;
    }
    return data;
  }

  if (!title && !subTopic && !alternativeTopics) {
    return (
      <Grid container alignContent="flex-start" className="phone-preview-component">
        <SpriteIcon name="search-flip" className="active titles-image big" />
      </Grid>
    );
  }

  return (
    <Grid container alignContent="flex-start" className="phone-preview-component title">
      <Grid container justify="center">
        <SpriteIcon name="search-flip" className="active titles-image" />
      </Grid>
      <div className="brick-preview-container">
        <div className={"brick-title uppercase " + (title ? 'topic-filled' : '')}>
          {title ? title : 'BRICK TITLE'}
        </div>
        <div className="brick-topics">
          <span className={subTopic ? 'topic-filled' : ''}>
            {subTopic ? subTopic : 'Topic'}
          </span> | <span className={alternativeTopics ? 'topic-filled' : ''}>
            {alternativeTopics ? alternativeTopics : 'Subtopic(s)'}
          </span>
        </div>
        <div className="author-row">
          {renderAuthorRow()}
        </div>
      </div>
    </Grid>
  )
}

class BrickTitle extends Component<BrickTitleProps, BrickTitleState> {
  constructor(props: BrickTitleProps) {
    super(props);

    this.state = {
      subjectSelectOpen: false,
      subTitleRef: React.createRef<HTMLDivElement>(),
      altTitleRef: React.createRef<HTMLDivElement>(),
    }
  }

  onChange(event: React.ChangeEvent<{ value: string }>, value: string) {
    event.stopPropagation();
    const title = event.target.value.substr(0, 49);
    this.props.saveTitles({ ...this.props.parentState, [value]: title });
  };

  moveToRef(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, refName: RefName) {
    if (enterPressed(e)) {
      let ref = this.state[refName];
      if (ref && ref.current) {
        ref.current.getElementsByTagName("input")[0].focus();
      }
    }
  }

  renderSubjectTitle(subjectName: string) {
    return (
      <div className="subject-text">
        <div>
          This will be {a(subjectName)} brick
        </div>
        <div className="icon-container" onClick={() => {
          if (this.props.user.subjects.length > 1) {
            this.props.history.push(map.ProposalSubject);
          } else {
            this.setState({subjectSelectOpen: true});
          }
        }}>
          <SpriteIcon name="edit-outline-custom" />
        </div>
      </div>
    );
  }

  render() {
    const { parentState, canEdit, baseUrl, saveTitles } = this.props;
    if (parentState.title) {
      setBrillderTitle(parentState.title);
    }

    let subjectName = '';
    try {
      const subject = this.props.subjects.find(s => s.id === parentState.subjectId)
      if (subject) {
        subjectName = subject.name;
      }
    } catch { }

    return (
      <div className="tutorial-page brick-title-page">
        <Navigation
          baseUrl={baseUrl}
          step={ProposalStep.BrickTitle}
          playStatus={this.props.playStatus}
          saveAndPreview={this.props.saveAndPreview}
          onMove={() => saveTitles(parentState)}
        />
        <Grid container direction="row">
          <Grid item className="left-block">
            <div className="mobile-view-image">
              <img alt="titles" src="/images/new-brick/titles.png" />
            </div>
            <h1>
              {subjectName && this.renderSubjectTitle(subjectName)}
              What is it about?
            </h1>
            <form>
              <Grid item className="input-container">
                <div className="audience-inputs">
                  <Input
                    disabled={!canEdit}
                    value={parentState.title}
                    onKeyUp={e => this.moveToRef(e, RefName.subTitleRef)}
                    onChange={e => this.onChange(e, "title")}
                    placeholder="Enter Proposed Title Here..."
                  />
                </div>
                <div className="audience-inputs">
                  <Input
                    ref={this.state.subTitleRef}
                    disabled={!canEdit}
                    value={parentState.subTopic}
                    onKeyUp={e => this.moveToRef(e, RefName.altTitleRef)}
                    onChange={e => this.onChange(e, "subTopic")}
                    placeholder="Enter Topic..."
                  />
                </div>
                <div className="audience-inputs">
                  <Input
                    ref={this.state.altTitleRef}
                    disabled={!canEdit}
                    value={parentState.alternativeTopics}
                    onKeyUp={e => {
                      if (enterPressed(e)) {
                        saveTitles(parentState);
                        this.props.history.push(baseUrl + OpenQuestionRoutePart);
                      }
                    }}
                    onChange={e => this.onChange(e, "alternativeTopics")}
                    placeholder="Enter Subtopic(s)..."
                  />
                </div>
              </Grid>
            </form>
            <div className="tutorial-pagination">
              {this.props.user.subjects.length > 1
                ?
                <div className="centered">
                  <PrevButton
                    to={map.ProposalSubject}
                    isActive={true}
                    onHover={() => { }}
                    onOut={() => { }}
                  />
                </div>
                :
                <div className="centered text-theme-dark-blue bold" style={{ fontSize: '2vw', marginRight: '2vw' }} onClick={() => {
                  saveTitles(parentState);
                  this.props.history.push(baseUrl + OpenQuestionRoutePart);
                }}>
                  Next
                </div>
              }
              <div className="centered">
                <NextButton
                  isActive={true}
                  step={ProposalStep.BrickTitle}
                  canSubmit={true}
                  onSubmit={saveTitles}
                  data={parentState}
                  baseUrl={baseUrl}
                />
              </div>
            </div>
          </Grid>
          <ProposalPhonePreview Component={BrickTitlePreviewComponent} data={parentState} />
          <Hidden only={['xs', 'sm']}>
            <div className="red-right-block"></div>
          </Hidden>
        </Grid>
        {this.props.user.subjects.length <= 1 &&
          <AddSubjectDialog
            isOpen={this.state.subjectSelectOpen}
            user={this.props.user}
            close={() => this.setState({subjectSelectOpen: false})}
          />
        }
      </div>
    );
  }
}

export default BrickTitle;
