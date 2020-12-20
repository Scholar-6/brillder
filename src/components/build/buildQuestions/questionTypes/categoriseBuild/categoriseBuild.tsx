import React, { useEffect } from 'react'

import './categoriseBuild.scss'
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import { UniqueComponentProps } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import { SortCategory, QuestionValueType, SortAnswer } from 'components/interfaces/sort';
import DocumentWirisEditorComponent from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import { showSameAnswerPopup } from '../service/questionBuild';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

export interface CategoriseData {
  categories: SortCategory[];
}

export interface CategoriseBuildProps extends UniqueComponentProps {
  data: CategoriseData;
}

export const getDefaultCategoriseAnswer = () => {
  const newAnswer = () => ({ value: "", text: "", valueFile: "", answerType: QuestionValueType.String });
  const newCategory = () => ({ name: "", answers: [newAnswer()], height: '0%' })
  
  return { categories: [newCategory(), newCategory()] };
}

const CategoriseBuildComponent: React.FC<CategoriseBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const [categoryHeight, setCategoryHeight] = React.useState('0%');

  const newAnswer = () => ({ value: "", text: "", valueFile: "", answerType: QuestionValueType.String });
  const newCategory = () => ({ name: "", answers: [newAnswer()], height: '0%' })

  if (!data.categories) {
    data.categories = getDefaultCategoriseAnswer().categories;
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

  const answerChanged = (answer: SortAnswer, value: string) => {
    answer.value = value;
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

  const categoryChanged = (category: any, value: string) => {
    category.name = value;
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

  const renderAnswer = (category: SortCategory, answer: SortAnswer, i: number) => {
    let customClass = 'categorise-answer unique-component';
    if (answer.answerType === QuestionValueType.Image) {
      customClass = 'sort-image';
    }

    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.value = "";
      answer.valueFile = fileName;
      answer.answerType = QuestionValueType.Image;
      update();
      save();
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if ((answer.answerType === QuestionValueType.String || answer.answerType === QuestionValueType.None || !answer.answerType) && !answer.value) {
        isValid = false;
      }
    }
  
    if (isValid === false) {
      customClass += ' invalid-answer';
    }

    return (
      <div key={i} className={customClass}>
        {
          (category.answers.length > 1)
            && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeAnswer(category, i)}>
              <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
            </button>
        }
        <DocumentWirisEditorComponent
          disabled={locked}
          editOnly={editOnly}
          data={answer.value}
          placeholder="Enter Answer..."
          toolbar={['latex', 'chemType']}
          isValid={isValid}
          onBlur={() => {
            showSameAnswerPopup(i, category.answers, openSameAnswerDialog);
            save();
          }}
          onChange={value => { answerChanged(answer, value) }}
        />
        <QuestionImageDropZone
          answer={answer as any}
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
            (state.categories.length > 2)
              && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeCategory(key)}>
                <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
              </button>
          }
          <DocumentWirisEditorComponent
            disabled={locked}
            editOnly={editOnly}
            data={category.name}
            placeholder="Enter Category Heading..."
            toolbar={['latex', 'chemType']}
            validationRequired={validationRequired}
            onBlur={() => save()}
            onChange={value => categoryChanged(category, value)}
          />
          {
            category.answers.map((answer, key) => renderAnswer(category, answer, key))
          }
        </div>
        <AddAnswerButton
          locked={locked}
          addAnswer={() => addAnswer(category)}
          height={category.height}
          label="+ ANSWER"
        />
      </div>
    );
  }

  return (
    <div className="categorise-build unique-component">
      {
        state.categories.map((category, i) => renderCategory(category, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addCategory}
        height={categoryHeight}
        label="+ CATEGORY"
      />
    </div>
  )
}

export default CategoriseBuildComponent
