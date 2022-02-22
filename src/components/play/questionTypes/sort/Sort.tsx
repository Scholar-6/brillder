
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReactSortable } from 'react-sortablejs';

import './Sort.scss';
import { Question } from "model/question";
import CompComponent from '../Comp';
import { CompQuestionProps } from '../types';
import { ComponentAttempt } from 'components/play/model';
import { SortCategory, SortAnswer, QuestionValueType } from 'components/interfaces/sort';
import { DragAndDropStatus } from '../pairMatch/interface';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';

import ReviewEachHint from '../../baseComponents/ReviewEachHint';
import { getValidationClassName } from '../service';
import MathInHtml from 'components/play/baseComponents/MathInHtml';
import { ReactComponent as DragIcon } from 'assets/img/drag.svg';
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import SortImage from './SortImage';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isMobile } from 'react-device-detect';

interface UserCategory {
  name: string;
  choices: SortAnswer[];
}

export interface SortComponent {
  type: number;
  list: SortAnswer[];
  categories: SortCategory[];
}

interface SortProps extends CompQuestionProps {
  question: Question;
  component: SortComponent;
  attempt: ComponentAttempt<any>;
  answers: any;
  isPreview?: boolean; // phone preview in build
}

interface SortState {
  status: DragAndDropStatus;
  userCats: UserCategory[];
  choices: any;
  data?: any;
}

class Sort extends CompComponent<SortProps, SortState> {
  static unsortedTitle = "Drag from below into the above categories";

  constructor(props: SortProps) {
    super(props);

    let userCats: UserCategory[] = [];
    let choices: SortAnswer[] = [];

    for (let [catIndex, category] of (props.component.categories as any).entries()) {
      const cat = category as SortCategory;
      /* eslint-disable-next-line */
      cat.answers.forEach((a, i) => {
        let choice = Object.assign({}, a) as any;
        choice.text = choice.value;
        choice.id = generateId();
        choice.value = this.getChoiceIndex(catIndex, i);
        choices.push(choice as SortAnswer);
      });
      userCats.push({ choices: [], name: cat.name });
      catIndex++;
    }

    choices = this.shuffle(choices);

    userCats.push({ choices: [], name: Sort.unsortedTitle });
    this.prepareChoices(userCats, choices);

    // this is bad but it fixed issue. input answers should not be array.
    if (props.answers && props.answers.length !== 0) {
      this.diselectChoices(userCats);
      this.prepareChoices(userCats, choices);
    }

    if (props.isPreview === true && props.component) {
      userCats = this.getPhonePreviewCats(props);
    }

    this.state = { status: DragAndDropStatus.None, userCats, choices: this.getChoices() };
  }

  getPhonePreviewCats(props: SortProps) {
    let userCats: UserCategory[] = [];
    let choices: SortAnswer[] = [];

    for (let [catIndex, category] of (props.component.categories as any).entries()) {
      const cat = category as SortCategory;
      /* eslint-disable-next-line */
      cat.answers.forEach((a, i) => {
        let choice = Object.assign({}, a) as any;
        choice.text = choice.value;
        choice.value = this.getChoiceIndex(catIndex, i);
        choices.push(choice as SortAnswer);
      });
      userCats.push({ choices: [], name: cat.name });
      catIndex++;
    }

    userCats.push({ choices, name: Sort.unsortedTitle });

    return userCats;
  }

  diselectChoices(userCats: UserCategory[]) {
    for (let category of userCats) {
      category.choices = [];
    }
  }

  componentDidUpdate(prevProp: SortProps) {
    const { props } = this;
    if (props.isBookPreview && props.attempt) {
      // preview in book
      if (props.answers !== prevProp.answers) {
        let userCats: UserCategory[] = [];

        for (let cat of props.component.categories) {
          userCats.push({ choices: [], name: cat.name });
        }

        userCats.push({ choices: [], name: Sort.unsortedTitle });
        this.prepareChoices(userCats);
        this.setState({ userCats, choices: this.getChoices() });
      }
    } else {
      // preview in build
      if (props.isPreview === true && props.component) {
        if (props.component !== prevProp.component) {
          const userCats = this.getPhonePreviewCats(props);
          this.setState({ userCats, choices: [] });
        }
      }
    }
  }

  /**
   * When user selected choices in question and go back to this question.
   * move choices in exact positions user drag them in.
   */
  prepareChoices(userCats: UserCategory[], choices?: SortAnswer[]) {
    let hadError = false;
    if (this.props.attempt) {
      const { answer } = this.props.attempt;
      Object.keys(answer).forEach(value => {
        const keys = value.split('_');

        const catIndex = parseInt(keys[0]);
        const answerIndex = parseInt(keys[1]);

        try {
          const catAnswer = this.props.component.categories[catIndex].answers[answerIndex];

          let choice = Object.assign({}, catAnswer) as SortAnswer;
          choice.text = choice.value;
          choice.value = value;

          userCats[answer[value]].choices.push(choice as SortAnswer);
        } catch (e) {
          hadError = true;
        }
      });
    }

    console.log(hadError, choices);

    // if error emptify results
    if (hadError) {
      if (choices) {
        console.log(userCats);
        userCats.forEach(cat => cat.choices = []);
        userCats[userCats.length - 1].choices = choices;
      }
    }
  }

  setUserAnswers(userCats: any[]) {
    this.setState({ userCats });
  }

  getState(choice: string) {
    if (this.props.isReview && this.props.attempt && this.props.attempt === this.props.liveAttempt) {
      if (this.props.attempt.answer[choice] === this.state.choices[choice]) {
        return 1;
      } else {
        return -1;
      }
    }
    if (this.state.status !== DragAndDropStatus.Changed) {
      this.setState({status: DragAndDropStatus.Changed});
    }
    return 0;
  }

  shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getChoiceIndex(catIndex: number, answerIndex: number) {
    return catIndex + '_' + answerIndex;
  }

  getChoices() {
    let choices: any = {};
    this.props.component.categories.forEach((cat, index) => {
      cat.answers.forEach((choice, i) => choices[this.getChoiceIndex(index, i)] = index);
    });

    choices = this.shuffle(choices);
    return choices;
  }

  getAnswer(): any[] {
    var choices: any = {};
    this.state.userCats.forEach((cat, index) => {
      cat.choices.forEach(choice => choices[choice.value] = index);
    });
    return choices;
  }

  updateCategory(list: any[], index: number) {
    let userCats = this.state.userCats;
    userCats[index].choices = list;

    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }

    if (status === DragAndDropStatus.Changed && this.props.onAttempted) {
      this.props.onAttempted();
    }

    this.setState({ status, userCats });
  }

  renderChoiceContent(choice: SortAnswer) {
    if (choice.answerType === QuestionValueType.Image) {
      return (
        <div>
          <div className="sort-image-container">
            <SortImage valueFile={choice.valueFile} imageSource={choice.imageSource} />
          </div>
          {choice.imageCaption && <MathInHtml className="sort-caption" value={choice.imageCaption} />}
        </div>
      );
    } else if (choice.answerType === QuestionValueType.Sound) {
      return (
        <div style={{ width: '100%' }} className="audio-play">
          <Audio src={choice.soundFile} />
          <div>{choice.soundCaption}</div>
        </div>
      );
    }
    return <MathInHtml value={choice.text} />;
  }

  getHintIndex(choice: SortAnswer) {
    const keys = choice.value.split('_');

    const catIndex = parseInt(keys[0]);
    const answerIndex = parseInt(keys[1]);

    let realIndex = answerIndex;
    let catInd = 0;
    for (const cat of this.props.component.categories) {
      if (catIndex <= catInd) {
        break;
      }
      realIndex += cat.answers.length;
      catInd += 1;
    }
    return realIndex;
  }

  renderChoice(choice: SortAnswer, i: number, choiceIndex: number) {
    let isCorrect = this.getState(choice.value) === 1;
    let className = "sortable-item";
    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }
    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    const realIndex = this.getHintIndex(choice);

    return (
      <div className={className} key={choice.id ? choice.id : i}>
        <ListItem className="sort-choice-custom">
          <ListItemText>
            {this.renderChoiceContent(choice)}
            {(this.props.isReview || this.props.isPreview) &&
              <ReviewEachHint
                isPhonePreview={this.props.isPreview}
                isReview={this.props.isReview}
                isCorrect={isCorrect}
                index={realIndex}
                hint={this.props.question.hint}
              />
            }
          </ListItemText>
        </ListItem>
      </div>
    )
  }

  checkImages() {
    for (let category of this.props.component.categories) {
      let foundImage = category.answers.find((a: any) => a.valueFile);
      if (foundImage) {
        return true;
      }
    }
    return false;
  }

  render() {
    let count = -1;
    const incrementCount = () => count++;

    const unsorted = this.state.userCats[this.state.userCats.length - 1];
    const correct = !!this.props.attempt?.correct;

    const haveImage = this.checkImages();

    const ReactSortableV1 = ReactSortable as any;

    return (
      <div className="question-unique-play sort-play">
        <p>
          <span className="help-text"><DragIcon />Drag to rearrange. {
            haveImage && (isMobile
              ? <span><SpriteIcon name="f-zoom-in" />Double tap images to zoom.</span>
              : <span><SpriteIcon name="f-zoom-in" />Hover over images to zoom.</span>)
          }</span>
        </p>
        {isMobile ?  <p className="flex-center"><span className="help-text"><SpriteIcon name="flaticon-swipe" style={{paddingBottom: '2vw'}} className="rotate-90"/> Scroll on the right-hand side.</span></p> : ''}
        {
          this.state.userCats.map((cat, i) => (
            <div key={i}>
              <div className={`sort-category ${i === this.state.userCats.length - 1 && 'bg-theme-orange text-white'}`}>
                <MathInHtml value={cat.name} />
              </div>
              <div className="sort-category-list-container">
                {this.props.isBookPreview ? (
                  <div className="sortable-list">
                    {cat.choices.map((choice, i) => {
                      incrementCount();
                      return this.renderChoice(choice, i, count);
                    })}
                  </div>
                ) : (
                  correct === true
                    ? <div className={`${i === this.state.userCats.length - 1 ? 'unsorted' : unsorted.choices.length === 0 ? '' : 'category'} sortable-list`}>
                      {cat.choices.map((choice, i) => {
                        incrementCount();
                        return this.renderChoice(choice, i, count);
                      })}
                    </div>
                    :
                    <ReactSortableV1
                      list={cat.choices as any[]}
                      animation={150}
                      className={`${i === this.state.userCats.length - 1 ? 'unsorted' : unsorted.choices.length === 0 ? '' : 'category'} sortable-list`}
                      group={{ name: "cloning-group-name" }}
                      setList={(list: any[]) => this.updateCategory(list, i)}
                    >
                      {cat.choices.map((choice, i) => {
                        incrementCount();
                        return this.renderChoice(choice, i, count);
                      })}
                    </ReactSortableV1>
                )}
              </div>
            </div>
          ))
        }
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default Sort;
