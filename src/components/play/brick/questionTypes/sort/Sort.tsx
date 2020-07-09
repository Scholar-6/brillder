
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './Sort.scss';
import { Question } from "model/question";
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/brick/model/model';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import { ReactSortable } from 'react-sortablejs';
import {SortCategory, SortAnswer, QuestionValueType} from 'components/interfaces/sort';
import { DragAndDropStatus } from '../pairMatch/interface';


interface UserCategory {
  name: string;
  choices: SortAnswer[];
}

interface SortComponent {
  type: number;
  list: SortAnswer[];
  categories: SortCategory[];
}

interface SortProps extends CompQuestionProps {
  question: Question;
  component: SortComponent;
  attempt?: ComponentAttempt;
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

    for (let cat of props.component.categories) {
      choices = choices.concat(cat.answers);
      userCats.push({choices: [], name: cat.name});
    }

    choices = this.shuffle(choices);
      
    if (!props.attempt) {
      userCats.push({choices: choices, name: 'Unsorted'});
    } else {
      userCats.push({ choices: [], name: "Unsorted" });
      Object.keys(props.attempt.answer).forEach((value) => {
        if (props.attempt) {
          userCats[props.attempt.answer[value]].choices.push({value} as SortAnswer);
        }
      });
    }

    this.state = { status: DragAndDropStatus.None, userCats, choices: this.getChoices() };
  }

  UNSAFE_componentWillReceiveProps(props: SortProps) {
    if (props.isPreview === true && props.component) {
      let userCats:UserCategory[] = [];
      let choices:SortAnswer[] = [];
  
      for (let cat of props.component.categories) {
        choices = choices.concat(cat.answers);
        userCats.push({choices: [], name: cat.name});
      }

      userCats.push({choices: choices, name: 'Unsorted'});

      this.setState({
        userCats: userCats,
        choices: this.getChoices(),
        data: props.component.categories
      });
    }
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

  getChoices() {
    let choices:any = {};
    this.props.component.categories.forEach((cat, index) => {
      cat.answers.forEach((choice) => {
        choices[choice.value] = index;
      });
    });

    choices = this.shuffle(choices);
    return choices;
  }

  getAnswer(): any[] {
    var choices:any = {};
    this.state.userCats.forEach((cat, index) => {
      cat.choices.forEach((choice) => {
        choices[choice.value] = index;
      });
    });
    return choices;
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;

    let noAnswer = true;
    const unsortedCategory = this.props.component.categories.length;
    
    Object.keys(attempt.answer).forEach((key, index) => {
      if (attempt.answer[key] !== unsortedCategory) {
        noAnswer = false;
      }
      attempt.maxMarks += 5;
      if(attempt.answer[key] !== this.state.choices[key]) {
        attempt.correct = false;
      } else {
        if(!prev) {
          attempt.marks += markIncrement;
        } else if(prev.answer[key] !== this.state.choices[key]) {
          attempt.marks += markIncrement;
        }
      }
    });

    if(attempt.marks === 0 && Object.keys(attempt.answer).length !== 0 && !prev) attempt.marks = 1;

    if (noAnswer) {
      attempt.marks = 0;
    }

    return attempt;
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
    return <div dangerouslySetInnerHTML={{ __html: choice.value}} />;
  }

  renderChoice(choice: SortAnswer, i: number) {
    let isCorrect = this.getState(choice.value) === 1;
    let className="sortable-item";
    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }
    if (!this.props.isPreview && this.props.attempt) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        if (isCorrect) {
          className += " correct";
        } else {
          className+= " wrong";
        }
      }
    }
    return (
      <div className={className} key={i}>
        <ListItem>
          <ListItemText>
            {this.renderChoiceContent(choice)}
          </ListItemText>
        </ListItem>
      </div>
    )
  }

  render() {
    return (
      <div className="sort-play">
        {
          this.state.userCats.map((cat, i) => (
            <div key={i}>
              <div className="sort-category" dangerouslySetInnerHTML={{ __html: cat.name}} />
              <div className="sort-category-list-container">
                <ReactSortable
                  list={cat.choices as any[]}
                  animation={150}
                  className="sortable-list"
                  group={{ name: "cloning-group-name"}}
                  setList={(list) => this.updateCategory(list, i)}
                >
                  {
                    cat.choices.map((choice, i) => this.renderChoice(choice, i))
                  }
                </ReactSortable>
              </div>
            </div>
          ))
        }
        <ReviewGlobalHint
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default Sort;
