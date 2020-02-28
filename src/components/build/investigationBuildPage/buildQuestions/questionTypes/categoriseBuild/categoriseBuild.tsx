import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

import './categoriseBuild.scss'


interface Answer {
  value: string
}

interface SortCategory {
  name: string
  answers: Answer[]
}

export interface ChooseSeveralData {
  categories: SortCategory[]
}

export interface ChooseSeveralBuildProps {
  locked: boolean
  data: ChooseSeveralData
  updateComponent(component: any): void
}

const CategoriseBuildComponent: React.FC<ChooseSeveralBuildProps> = ({ locked, data, updateComponent }) => {
  const newAnswer = () => ({ value: "" });
  const newCategory = () => ({ name: "", answers: [newAnswer()] })

  if (!data.categories) {
    data.categories = [newCategory(), newCategory()];
  }

  const answerChanged = (answer: any, event: any) => {
    answer.value = event.target.value;
    updateComponent(data);
  }

  const addAnswer = (category: SortCategory) => {
    category.answers.push(newAnswer());
    updateComponent(data);
  }

  const removeAnswer = (category: SortCategory, index: number) => {
    category.answers.splice(index, 1);
    updateComponent(data);
  }

  const categoryChanged = (category: any, event: any) => {
    category.name = event.target.value;
    updateComponent(data);
  }

  const addCategory = () => {
    data.categories.push(newCategory());
    updateComponent(data);
  }

  const removeCategory = (index: number) => {
    data.categories.splice(index, 1);
    updateComponent(data);
  }

  const renderCategory = (category: SortCategory, key: number) => {
    return (
      <div className="choose-several-box" key={key}>
        {
          (data.categories.length > 2) ? <DeleteIcon className="right-top-icon" onClick={() => removeCategory(key)} /> : ""
        }
        <input disabled={locked} value={category.name} onChange={(event) => categoryChanged(category, event)} placeholder="Enter Category Heading..." />
        {
          category.answers.map((answer, key) => {
            return (
              <div style={{position: 'relative'}} key={key}>
                {
                  (category.answers.length > 1) ? <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(category, key)} /> : ""
                }
                <input disabled={locked} value={answer.value} onChange={(event: any) => { answerChanged(answer, event) }} placeholder="Enter Answer..." />
              </div>
            );
          })
        }
        <div className="button-box">
          <Button disabled={locked} className="add-answer-button" onClick={() => { addAnswer(category) }}>
            + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="choose-several-build">
      {
        data.categories.map((category, i) => renderCategory(category, i))
      }
      <div className="button-box">
        <Button disabled={locked} className="add-answer-button" onClick={addCategory}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; C &nbsp; A &nbsp; T &nbsp; E &nbsp; G &nbsp; O &nbsp; R &nbsp; Y
        </Button>
      </div>
    </div>
  )
}

export default CategoriseBuildComponent
