
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import './Sort.scss';
import { Question } from "model/question";
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/brick/model/model';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import { ReactSortable } from 'react-sortablejs';
import DenimCrossRect from 'components/play/components/DenimCrossRect';
import DenimTickRect from 'components/play/components/DenimTickRect';
import {SortCategory, SortAnswer, QuestionValueType} from 'components/interfaces/sort';


interface UserCategory {
  name: string;
  choices: SortAnswer[];
}

interface SortComponent {
  type: number;
  list: SortAnswer[];
  categories: SortCategory[];
}

interface SortProps {
  question: Question;
  component: SortComponent;
  attempt?: ComponentAttempt;
  answers: number;
  isPreview?: boolean;
}

interface SortState {
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

    this.state = { userCats, choices: this.getChoices() };
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
    this.setState({userCats});
  }

  renderIcon(index: number) {
    if (this.props.attempt) {
      return (
        <ListItemIcon>
          {
            (this.props.attempt.answer[index].index === index) ? <DenimTickRect/> : <DenimCrossRect />
          }
        </ListItemIcon>
      );
    }
    return "";
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
    return choice.value;
  }

  renderChoice(choice: SortAnswer, i: number) {
    return (
      <div className="sortable-item" key={i}>
        <ListItem>
          <ListItemIcon>
            {
              this.props.attempt 
                ? (this.getState(choice.value) === 1)
                  ? <DenimTickRect />
                  : <DenimCrossRect />
                : <div></div>
            }
          </ListItemIcon>
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
              <div className="sort-category">{cat.name}</div>
              <div className="sort-category-list-container">
                <ReactSortable
                  list={cat.choices as any[]}
                  animation={150}
                  className="sortable-list"
                  group={{ name: "cloning-group-name"}}
                  setList={(list) => this.updateCategory(list, i)}
                >
                  {
                    cat.choices.map((choice:any, i:number) =>
                      this.renderChoice(choice, i)
                    )
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
