
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReactSortable } from 'react-sortablejs';

import './Sort.scss';
import { Question } from "model/question";
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/model';
import {SortCategory, SortAnswer, QuestionValueType} from 'components/interfaces/sort';
import { DragAndDropStatus } from '../pairMatch/interface';

import ReviewEachHint from '../../baseComponents/ReviewEachHint';
import { getValidationClassName } from '../service';


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
  answers: number;
  isPreview?: boolean;
}

interface SortState {
  status: DragAndDropStatus;
  userCats: UserCategory[];
  choices: any;
  data?: any;
}

class Sort extends CompComponent<SortProps, SortState> {
  constructor(props: SortProps) {
    super(props);

    let userCats:UserCategory[] = [];
    let choices:SortAnswer[] = [];

    for (let [catIndex, category] of (props.component.categories as any).entries()) {
      const cat = category as SortCategory;
      /* eslint-disable-next-line */
      cat.answers.forEach((a, i) => {
        let choice = Object.assign({}, a) as any;
        choice.text = choice.value;
        choice.value = this.getChoiceIndex(catIndex, i);
        choices.push(choice as SortAnswer);
      });
      userCats.push({choices: [], name: cat.name});
      catIndex++;
    }

    choices = this.shuffle(choices);

    if (!props.isReview) {
      userCats.push({choices: choices, name: 'Unsorted'});
    } else {
      userCats.push({ choices: [], name: "Unsorted" });
      this.prepareChoices(userCats);
    }

    this.state = { status: DragAndDropStatus.None, userCats, choices: this.getChoices() };
  }

  componentDidUpdate(prevProp: SortProps) {
    const {props} = this;
    if (props.isBookPreview && props.attempt) {
      // preview in book
      if (props.answers !== prevProp.answers) {
        let userCats:UserCategory[] = [];

        for (let cat of props.component.categories) {
          userCats.push({choices: [], name: cat.name});
        }
    
        userCats.push({ choices: [], name: "Unsorted" });
        this.prepareChoices(userCats);
        this.setState({userCats, choices: this.getChoices()});
      }
    } else {
      // preview in build
      if (props.isPreview === true && props.component) {
        if (props.component !== prevProp.component) {
          let userCats:UserCategory[] = [];
          let choices:SortAnswer[] = [];
    
          for (let [catIndex, category] of (props.component.categories as any).entries()) {
            const cat = category as SortCategory;
            /* eslint-disable-next-line */
            cat.answers.forEach((a, i) => {
              let choice = Object.assign({}, a) as any;
              choice.text = choice.value;
              choice.value = this.getChoiceIndex(catIndex, i);
              choices.push(choice as SortAnswer);
            });
            userCats.push({choices: [], name: cat.name});
            catIndex++;
          }
  
          userCats.push({choices, name: 'Unsorted'});
  
          this.setState({userCats, choices});
        }
      }
    }
  }

  prepareChoices(userCats: UserCategory[]) {
    const {answer} = this.props.attempt;
    Object.keys(answer).forEach(value => {
      let keys = value.split('_');

      let catIndex = parseInt(keys[0]);
      let answerIndex = parseInt(keys[1]);

      try {
        let catAnswer = this.props.component.categories[catIndex].answers[answerIndex];

        let choice = Object.assign({}, catAnswer) as SortAnswer;
        choice.text = choice.value;
        choice.value = value;
  
        userCats[answer[value]].choices.push(choice as SortAnswer);
      } catch {}
    });
  }

  setUserAnswers(userCats: any[]) {
    this.setState({ userCats });
  }

  getState(choice: string) {
    if (this.props.attempt) {
      if(this.props.attempt.answer[choice] === this.state.choices[choice]) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getChoiceIndex(catIndex:number, answerIndex: number) {
    return catIndex + '_' + answerIndex;
  }

  getChoices() {
    let choices:any = {};
    this.props.component.categories.forEach((cat, index) => {
      cat.answers.forEach((choice, i) => choices[this.getChoiceIndex(index, i)] = index);
    });

    choices = this.shuffle(choices);
    return choices;
  }

  getAnswer(): any[] {
    var choices:any = {};
    this.state.userCats.forEach((cat, index) => {
      cat.choices.forEach(choice => choices[choice.value] = index);
    });
    return choices;
  }

  updateCategory(list: any[], index:number) {
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
        <img
          alt="" className="sort-image-choice"
          src={`${process.env.REACT_APP_BACKEND_HOST}/files/${choice.valueFile}`}
        />
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: choice.text}} />;
  }

  renderChoice(choice: SortAnswer, i: number, choiceIndex: number) {
    let isCorrect = this.getState(choice.value) === 1;
    let className="sortable-item";
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

    return (
      <div className={className} key={i}>
        <ListItem className="sort-choice-custom">
          <ListItemText>
            {this.renderChoiceContent(choice)}
            {this.props.isReview || this.props.isPreview ?
              <ReviewEachHint
                isPhonePreview={this.props.isPreview}
                isReview={this.props.isReview}
                isCorrect={isCorrect}
                index={choiceIndex}
                hint={this.props.question.hint}
              />
              : ""
            }
          </ListItemText>
        </ListItem>
      </div>
    )
  }

  render() {
    let count = -1;
    const incrementCount = () => count++;

    return (
      <div className="question-unique-play sort-play">
        <p><span className="help-text">Drag to rearrange.</span></p>
        {
          this.state.userCats.map((cat, i) => (
            <div key={i}>
              <div className="sort-category" dangerouslySetInnerHTML={{ __html: cat.name}} />
              <div className="sort-category-list-container">
                {this.props.isBookPreview ? (
                  <div className="sortable-list">
                    {cat.choices.map((choice, i) => {
                      incrementCount();
                      return this.renderChoice(choice, i, count);
                    })}
                  </div>
                ): (
                  <ReactSortable
                    list={cat.choices as any[]}
                    animation={150}
                    className="sortable-list"
                    group={{ name: "cloning-group-name"}}
                    setList={(list) => this.updateCategory(list, i)}
                  >
                    {cat.choices.map((choice, i) => {
                      incrementCount();
                      return this.renderChoice(choice, i, count);
                    })}
                  </ReactSortable>
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
