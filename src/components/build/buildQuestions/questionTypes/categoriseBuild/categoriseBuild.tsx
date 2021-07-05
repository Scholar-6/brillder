import React, { useEffect } from 'react'

import './categoriseBuild.scss'
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import { UniqueComponentProps } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import { SortCategory, QuestionValueType, SortAnswer } from 'components/interfaces/sort';
import { showSameAnswerPopup } from '../service/questionBuild';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import ValidationFailedDialog from 'components/baseComponents/dialogs/ValidationFailedDialog';
import RemoveButton from '../components/RemoveButton';
import QuillEditorContainer from 'components/baseComponents/quill/QuillEditorContainer';
import SoundRecord from '../sound/SoundRecord';


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
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog, removeHintAt
}) => {
  const [categoryHeight, setCategoryHeight] = React.useState('0%');
  const [sameCategoryOpen, setSameCategory] = React.useState(false);

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
        if (answer.answerType !== QuestionValueType.Image && answer.answerType !== QuestionValueType.Sound) {
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
    save();
  }

  const addAnswer = (category: SortCategory) => {
    category.answers.push(newAnswer());
    update();
    save();
  }

  const removeAnswer = (category: SortCategory, index: number) => {
    category.answers.splice(index, 1);
    
    const catIndex = state.categories.indexOf(category);
    let hintIndex = state.categories.slice(0, catIndex).reduce((idx, cat) => idx + cat.answers.length, 0);
    hintIndex += index;
    removeHintAt(hintIndex);
    update();
    save();
  }

  const categoryChanged = (category: any, value: string) => {
    category.name = value;
    update();
    save();
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

  const renderAnswer = (category: SortCategory, answer: SortAnswer, i: number, catIndex: number) => {
    let customClass = 'categorise-answer unique-component';
    if (answer.answerType === QuestionValueType.Image) {
      customClass = 'sort-image';
    }

    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.value = "";
      if (fileName) {
        answer.valueFile = fileName;
      }
      answer.answerType = QuestionValueType.Image;
      update();
      save();
    }

    const setSound = (soundFile: string, caption: string) => {
      if (locked) { return; }
      answer.value = '';
      answer.valueFile = '';
      answer.soundFile = soundFile;
      answer.soundCaption = caption;
      answer.answerType = QuestionValueType.Sound;
      update();
      save();
    }

    const onTextChanged = (answer: any, value: string) => {
      if (locked) { return; }
      answer.value = value;
      answer.valueFile = "";
      answer.soundFile = "";
      answer.answerType = QuestionValueType.String;
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

    const checkCategoriesAnswers = () => {
      if (answer.value) {
        for (let cat of state.categories) {
          if (cat !== category) {
            cat.answers.forEach(a => {
              if (a.value === answer.value) {
                openSameAnswerDialog();
              }
            });
          }
        }
      }
    }

    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div className="categorise-sound unique-component" key={i}>
          <RemoveButton onClick={() => answerChanged(answer, '')} />
          <SoundRecord
            locked={locked}
            answer={answer as any}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
        </div>
      );
    }

    return (
      <div key={i} className={customClass}>
        {
          (category.answers.length > 1)
          && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeAnswer(category, i)}>
            <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
          </button>
        }
        {answer.answerType === QuestionValueType.Image && <RemoveButton onClick={() => answerChanged(answer, '')} />}
        {answer.answerType !== QuestionValueType.Image &&
        <QuillEditorContainer
          locked={locked}
          object={answer}
          fieldName="value"
          placeholder="Enter Answer..."
          toolbar={['latex']}
          validationRequired={validationRequired}
          isValid={isValid}
          onBlur={() => {
            showSameAnswerPopup(i, category.answers, openSameAnswerDialog);
            checkCategoriesAnswers();
            save();
          }}
          onChange={value => { answerChanged(answer, value) }}
        />}
        <QuestionImageDropZone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          fileName={answer.valueFile}
          locked={locked}
          update={setImage}
        />
        <SoundRecord
          locked={locked}
          answer={answer as any}
          save={setSound}
          clear={() => onTextChanged(answer, '')}
        />
      </div>
    );
  }

  const renderCategory = (category: SortCategory, key: number) => {
    let className = 'categorise-box';
    if (validationRequired) {
      if (!category.name) {
        className += ' invalid-category';
      }
    }

    const checkCategoriesNames = () => {
      if (category.name) {
        for (let cat of state.categories) {
          if (cat !== category) {
            if (cat.name === category.name) {
              setSameCategory(true);
              return;
            }
          }
        }
      }
    }

    return (
      <div key={key}>
        <div className={className}>
          {
            (state.categories.length > 2)
            && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeCategory(key)}>
              <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
            </button>
          }
          <QuillEditorContainer
            locked={locked}
            object={category}
            fieldName="name"
            placeholder="Enter Category Heading..."
            toolbar={['latex']}
            validationRequired={validationRequired}
            onBlur={() => {
              checkCategoriesNames();
              save()
            }}
            onChange={value => categoryChanged(category, value)}
          />
          {
            category.answers.map((answer, answerKey) => renderAnswer(category, answer, answerKey, key))
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
      <ValidationFailedDialog
        isOpen={sameCategoryOpen}
        header="Some Category Headings are the same."
        label="This will confuse students. Please make sure they are all different."
        close={() => setSameCategory(false)}
      />
    </div>
  )
}

export default CategoriseBuildComponent
