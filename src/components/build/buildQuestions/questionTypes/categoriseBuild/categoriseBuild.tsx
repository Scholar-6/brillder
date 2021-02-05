import React, { useEffect } from 'react';
import * as Y from "yjs";

import './categoriseBuild.scss'
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import { UniqueComponentProps } from '../types';
import QuestionImageDropZone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import { SortCategory, QuestionValueType, SortAnswer } from 'components/interfaces/sort';
import DocumentWirisEditorComponent from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import { generateId, showSameAnswerPopup } from '../service/questionBuild';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import ValidationFailedDialog from 'components/baseComponents/dialogs/ValidationFailedDialog';

export interface CategoriseData {
  categories: SortCategory[];
}

export interface CategoriseBuildProps extends UniqueComponentProps {
  data: Y.Map<any>;
}

export const getDefaultCategoriseAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), text: "", valueFile: "", answerType: QuestionValueType.String, id: generateId() }));
  const newCategory = () => {
    const answers = new Y.Array();
    answers.push([newAnswer()]);
    return new Y.Map(Object.entries({ name: new Y.Text(), answers, height: '0%', id: generateId() }));
  }

  const categories = new Y.Array();
  categories.push([newCategory(), newCategory()]);
  ymap.set("categories", categories);
}

const CategoriseBuildComponent: React.FC<CategoriseBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const [categoryHeight, setCategoryHeight] = React.useState('0%');
  const [sameCategoryOpen, setSameCategory] = React.useState(false);

  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), text: "", valueFile: "", answerType: QuestionValueType.String, id: generateId() }));
  const newCategory = () => {
    const answers = new Y.Array();
    answers.push([newAnswer()]);
    return new Y.Map(Object.entries({ name: new Y.Text(), answers, height: '0%', id: generateId() }));
  }

  let categories = data.get("categories") as Y.Array<any>;

  if (!categories) {
    getDefaultCategoriseAnswer(data);
    categories = data.get("categories");
  }

  useEffect(() => calculateCategoryHeight());
  const calculateCategoryHeight = () => {
    let showButton = true;
    categories.forEach((category: Y.Map<any>) => {
      if (category.get("name").toString() === "") {
        showButton = false;
      }
      let autoHeight = true;
      category.get("answers").forEach((answer: Y.Map<any>) => {
        if (answer.get("answerType") !== QuestionValueType.Image) {
          if (!answer.get("value").toString()) {
            autoHeight = false;
          }
        }
      });
      if(autoHeight && category.get("height") !== "auto") {
        category.set("height", "auto");
      } else if (!autoHeight && category.get("height") !== "0%") {
        category.set("height", "0%");
      }
    })
    showButton === true ? setCategoryHeight('auto') : setCategoryHeight('0%');
  }

  const addAnswer = (category: Y.Map<any>) => {
    category.get("answers").push([newAnswer()]);
  }

  const removeAnswer = (category: Y.Map<any>, index: number) => {
    category.get("answers").delete(index);
  }

  const addCategory = () => {
    categories.push([newCategory()]);
  }

  const removeCategory = (index: number) => {
    categories.delete(index);
  }

  const renderAnswer = (category: Y.Map<any>, answer: Y.Map<any>, i: number, catIndex: number) => {
    let customClass = 'categorise-answer unique-component';
    if (answer.get("answerType") === QuestionValueType.Image) {
      customClass = 'sort-image';
    }

    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.set("value", "");
      answer.set("valueFile", fileName);
      answer.set("answerType", QuestionValueType.Image);
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if ((answer.get("answerType") === QuestionValueType.String || answer.get("answerType") === QuestionValueType.None || !answer.get("answerType")) && !answer.get("value")) {
        isValid = false;
      }
    }

    if (isValid === false) {
      customClass += ' invalid-answer';
    }

    const checkCategoriesAnswers = () => {
      if (answer.get("value")) {
        categories.forEach((cat: Y.Map<any>) => {
          if (cat !== category) {
            cat.get("answers").forEach((a: Y.Map<any>) => {
              if (a.get("value").toString() === answer.get("value").toString()) {
                openSameAnswerDialog();
              }
            });
          }
        });
      }
    }

    return (
      <div key={answer.get("id")} className={customClass}>
        {
          (category.get("answers").length > 1)
          && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeAnswer(category, i)}>
            <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
          </button>
        }
        <QuillEditor
          disabled={locked}
          sharedData={answer.get("value")}
          placeholder="Enter Answer..."
          toolbar={['latex']}
          validate={validationRequired}
          isValid={isValid}
          onBlur={() => {
            showSameAnswerPopup(i, category.get("answers").toJSON(), openSameAnswerDialog);
            checkCategoriesAnswers();
          }}
        />
        <QuestionImageDropZone
          answer={answer as any}
          type={answer.get("answerType") || QuestionValueType.None}
          fileName={answer.get("valueFile")}
          locked={locked}
          update={setImage}
        />
      </div>
    );
  }

  const renderCategory = (category: Y.Map<any>, key: number) => {
    let className = 'categorise-box';
    if (validationRequired) {
      if (!category.get("name")) {
        className += ' invalid-category';
      }
    }

    const checkCategoriesNames = () => {
      if (category.get("name")) {
        categories.forEach((cat: Y.Map<any>) => {
          if (cat !== category) {
            if (cat.get("name").toString() === category.get("name").toString()) {
              setSameCategory(true);
              return;
            }
          }
        });
      }
    }

    return (
      <div key={category.get("id")}>
        <div className={className}>
          {
            (categories.length > 2)
            && <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeCategory(key)}>
              <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
            </button>
          }
          <QuillEditor
            disabled={locked}
            sharedData={category.get("name")}
            placeholder="Enter Category Heading..."
            toolbar={['latex']}
            validate={validationRequired}
            onBlur={() => {
              checkCategoriesNames();
            }}
          />
          {
            category.get("answers").map((answer: Y.Map<any>, answerKey: number) => renderAnswer(category, answer, answerKey, key))
          }
        </div>
        <AddAnswerButton
          locked={locked}
          addAnswer={() => addAnswer(category)}
          height={category.get("height")}
          label="+ ANSWER"
        />
      </div>
    );
  }

  return (
    <div className="categorise-build unique-component">
      {
        categories.map((category: Y.Map<any>, i) => renderCategory(category, i))
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
