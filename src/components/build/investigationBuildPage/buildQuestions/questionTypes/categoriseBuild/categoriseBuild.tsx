import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

import './categoriseBuild.scss'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import { UniqueComponentProps } from '../types';
import QuestionImageDropZone from '../../baseComponents/QuestionImageDropzone';
import {SortCategory, QuestionValueType, SortAnswer} from 'components/interfaces/sort';


export interface CategoriseData {
  categories: SortCategory[];
}

export interface CategoriseBuildProps extends UniqueComponentProps {
  data: CategoriseData;
}

const CategoriseBuildComponent: React.FC<CategoriseBuildProps> = ({
  locked, data, validationRequired, save, updateComponent
}) => {
  const [categoryHeight, setCategoryHeight] = React.useState('0%');

  const newAnswer = () => ({ value: "", valueFile: "", answerType: QuestionValueType.String });
  const newCategory = () => ({ name: "", answers: [newAnswer()], height: '0%' })

  if (!data.categories) {
    data.categories = [newCategory(), newCategory()];
  }

  const [state, setState] = React.useState(data);

  useEffect(() => calculateCategoryHeight());
  useEffect(() => setState(data), [data]);

  const calculateCategoryHeight = () => {
    let showButton = true;
    let categories = [];
    for (let category of state.categories) {
      if (category.name === "") {
        showButton = false;
      }
      category.height = 'auto';
      for (let answer of category.answers) {
        if (answer.answerType !== QuestionValueType.Image) {
          if (!answer.value) {
            category.height = "0%";
          }
        }
      }
      categories.push(category);
    }
    showButton === true ? setCategoryHeight('auto') : setCategoryHeight('0%');
    setState(state);
  }

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

  const answerChanged = (answer: any, event: any) => {
    answer.value = event.target.value;
    answer.valueFile = '';
    answer.answerType = QuestionValueType.String;
    update();
  }

  const addAnswer = (category: SortCategory) => {
    category.answers.push(newAnswer());
    update();
    save();
  }

  const removeAnswer = (category: SortCategory, index: number) => {
    category.answers.splice(index, 1);
    update();
    save();
  }

  const categoryChanged = (category: any, event: any) => {
    category.name = event.target.value;
    update();
  }

  const addCategory = () => {
    state.categories.push(newCategory());
    update();
    save();
  }

  const removeCategory = (index: number) => {
    state.categories.splice(index, 1);
    update();
    save();
  }


  const renderAnswer = (category: SortCategory, answer: SortAnswer, key: number) => {
    let customClass = '';
    if (answer.answerType === QuestionValueType.Image) {
      customClass = 'sort-image';
    }

    const setImage = (fileName: string) => {
      if (locked) {return;}
      answer.value = "";
      answer.valueFile = fileName;
      answer.answerType = QuestionValueType.Image;
      update();
      save();
    }
  
    return (
      <div style={{position: 'relative'}} key={key} className={customClass}>
        {
          (category.answers.length > 1)
            ? <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(category, key)} />
            : ""
        }
        <input
          disabled={locked}
          value={answer.value}
          placeholder="Enter Answer..."
          className={validationRequired && !answer.value ? "invalid answer" : "answer"}
          onBlur={() => save()}
          onChange={(event: any) => { answerChanged(answer, event) }}
        />
        <QuestionImageDropZone
          answer={answer}
          type={answer.answerType || QuestionValueType.None}
          fileName={answer.valueFile}
          locked={locked}
          update={setImage}
        />
      </div>
    );
  }

  const renderCategory = (category: SortCategory, key: number) => {
    return (
      <div key={key}>
        <div className="categorise-box">
          {
            (state.categories.length > 2) ? <DeleteIcon className="right-top-icon" onClick={() => removeCategory(key)} /> : ""
          }
          <input
            disabled={locked}
            value={category.name}
            placeholder="Enter Category Heading..."
            className={validationRequired && !category.name ? "invalid" : ""}
            onBlur={() => save()}
            onChange={(event) => categoryChanged(category, event)}
          />
          {
            category.answers.map((answer, key) => renderAnswer(category, answer, key))
          }
        </div>
        <AddAnswerButton
          locked={locked}
          addAnswer={() => addAnswer(category)}
          height={category.height}
          label="+ &nbsp;&nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R"
        />
      </div>
    );
  }

  return (
    <div className="categorise-build">
      {
        state.categories.map((category, i) => renderCategory(category, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addCategory}
        height={categoryHeight}
        label="+ &nbsp;&nbsp; C &nbsp; A &nbsp; T &nbsp; E &nbsp; G &nbsp; O &nbsp; R &nbsp; Y"
      />
    </div>
  )
}

export default CategoriseBuildComponent
