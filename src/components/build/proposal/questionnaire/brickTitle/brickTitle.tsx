import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Grid, Hidden } from "@material-ui/core";

import './brickTitle.scss';
import { ProposalStep, OpenQuestionRoutePart } from "../../model";
import { AcademicLevel, Brick, KeyWord, Subject } from "model/brick";
import { getDate, getMonth, getYear } from 'components/services/brickService';
import { getBrillderTitle } from "components/services/titleService";
import { enterPressed } from "components/services/key";

import NextButton from '../../components/nextButton';
import PrevButton from "../../components/previousButton";
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';

import SpriteIcon from "components/baseComponents/SpriteIcon";

import a from 'indefinite';
import map from "components/map";
import { User } from "model/user";
import AddSubjectDialog from "./components/AddSubjectDialog";
import KeyWordsComponent from "./components/KeyWords";
import DifficultySelect from "./components/DifficultySelect";
import KeyWordsPlay from "./components/KeywordsPlay";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import HoverHelp from "components/baseComponents/hoverHelp/HoverHelp";

enum RefName {
  subTitleRef = 'subTitleRef',
  altTitleRef = 'altTitleRef'
}

interface BrickTitleProps {
  user: User;
  brickId: number;
  history: any;
  baseUrl: string;
  parentState: Brick;
  canEdit: boolean;
  subjects: Subject[];
  createBrick(): void;
  saveTitles(data: any): void;
  setKeywords(keywords: KeyWord[]): void;
  setAcademicLevel(level: AcademicLevel): void;
}

interface BrickTitleState {
  subjectSelectOpen: boolean;
  subTitleRef: React.RefObject<HTMLDivElement>;
  altTitleRef: React.RefObject<HTMLDivElement>;
}

interface PreviewProps {
  data: Brick;
}

const BrickTitlePreviewComponent: React.FC<PreviewProps> = (props) => {
  let { keywords, title, author } = props.data;

  const date = new Date();
  const dateString = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;

  if (!title && (!keywords || keywords.length < 0)) {
    return (
      <Grid container alignContent="flex-start" className="phone-preview-component">
        <SpriteIcon name="search-flip" className="active titles-image big" />
      </Grid>
    );
  }
  
  const renderAuthorRow = () => {
    let data = "";
    if (author) {
      data = (author.firstName ? author.firstName + ' ' + author.lastName : 'Author') + ' | ' + dateString;
    } else {
      data = "Author | " + dateString;
    }
    return data;
  }

  return (
    <Grid container alignContent="flex-start" className="phone-preview-component title">
      <Grid container justify="center">
        <SpriteIcon name="search-flip" className="active titles-image" />
      </Grid>
      <div className="brick-preview-container">
        <div className={"brick-title uppercase " + (title ? 'topic-filled' : '')}>
          {title ? <div dangerouslySetInnerHTML={{ __html: title }} /> : 'BRICK TITLE'}
        </div>
        <div className="brick-topics">
          {keywords && 
            <span className={keywords.length > 0 ? 'topic-filled' : ''}>
              {keywords.length > 0 ? <KeyWordsPlay keywords={keywords} /> : 'Keyword(s)'}
            </span>}
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
    if (!props.brickId) {
      props.createBrick();
    }
  }

  onChange(event: React.ChangeEvent<{ value: string }>, value: string) {
    event.stopPropagation();
    const title = event.target.value.substr(0, 49);
    this.props.saveTitles({ ...this.props.parentState, [value]: title });
  };

  onTitleChange(value: string) {
    const title = value.substr(0, 49);
    this.props.saveTitles({ ...this.props.parentState, title });
  }

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
        <div className="icon-container tooltip-container" onClick={() => {
          if (this.props.user.subjects.length > 1) {
            this.props.history.push(map.ProposalSubject(this.props.brickId));
          } else {
            this.setState({subjectSelectOpen: true});
          }
        }}>
          <SpriteIcon name="edit-outline-custom" />
          <div className="css-custom-tooltip">Change subject</div>
        </div>
      </div>
    );
  }

  render() {
    const { parentState, canEdit, baseUrl, saveTitles } = this.props;

    let subjectName = '';
    try {
      const subject = this.props.subjects.find(s => s.id === parentState.subjectId)
      if (subject) {
        subjectName = subject.name;
      }
    } catch { }

    return (
      <div className="tutorial-page brick-title-page">
        <Helmet>
          <title>{getBrillderTitle(parentState.title)}</title>
        </Helmet>
        <Navigation
          baseUrl={baseUrl}
          step={ProposalStep.BrickTitle}
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
                  <QuillEditor
                    data={parentState.title}
                    onChange={title => this.onTitleChange(title)}
                    placeholder="Proposed Title"
                    tabIndex={-1}
                    disabled={!canEdit}
                    showToolbar={true}
                    toolbar={[
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
                    enabledToolbarOptions={['italic']}
                  />
                  <div className="absolute-title-help">
                    <HoverHelp>
                      Be punchy and succinct. This ought to be written in Camel or Sentence Case, and give a reasonable indication of the content of the brick. If you would like to use a more playful title, remember to add relevant keywords in the section below, so that your brick is more likely to appear to interested learners.
                    </HoverHelp>
                  </div>
                </div>
                {/*
                <div className="audience-inputs">
                  <KeyWordsComponent disabled={!canEdit} keyWords={parentState.keywords} onChange={this.props.setKeywords.bind(this)} />
                  <div className="absolute-keyword-help">
                    <HoverHelp>
                      Keywords are best thought of as likely search terms, and are ultimately curated by Publishers for each subject. For multi-word keywords, separate words with a hyphen, eg. ‘19th-Century’.
                    </HoverHelp>
                  </div>
                </div> */}
                <div className="audience-inputs">
                  <DifficultySelect disabled={!canEdit} level={parentState.academicLevel} onChange={this.props.setAcademicLevel.bind(this)} />
                  <div className="absolute-difficult-help">
                    <HoverHelp>
                    <div className="flex-content">
                    <div>Brillder focusses on universal concepts and topics, not specific exam courses.</div>
                    <br />
                    <div>LEVELS:</div>
                    <div className="container">
                      <div className="white-circle">I</div>
                      <div className="l-text">
                        <div>Foundation</div>
                        <div className="regular">For 15-16 yr-olds, equivalent to GCSE / IB Middle Years / High School Diploma</div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">II</div>
                      <div className="l-text">
                        <div>Core</div>
                        <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="white-circle">III</div>
                      <div className="l-text">
                        <div>Extension</div>
                        <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) learners</div>
                      </div>
                    </div>
                  </div>
                    </HoverHelp>
                  </div>
                </div>
              </Grid>
            </form>
            <div className="tutorial-pagination">
              {this.props.user.subjects.length > 1
                ?
                <div className="centered">
                  <PrevButton
                    to={baseUrl + "/subject"}
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
          <ProposalPhonePreview Component={BrickTitlePreviewComponent} data={parentState} updated={parentState.updated} />
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
