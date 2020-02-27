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
  data: ChooseSeveralData
  updateComponent(component: any): void
}

const CategoriseBuildComponent: React.FC<ChooseSeveralBuildProps> = ({ data, updateComponent }) => {
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
        <DeleteIcon className="right-top-icon" onClick={() => removeCategory(key)} />
        <input value={category.name} onChange={(event) => categoryChanged(category, event)} placeholder="Enter category heading..." />
        {
          category.answers.map((answer, key) => {
            return (
              <div style={{position: 'relative'}} key={key}>
                <DeleteIcon className="right-top-icon" onClick={() => removeAnswer(category, key)} />
                <input value={answer.value} onChange={(event: any) => { answerChanged(answer, event) }} placeholder="Enter answer..." />
              </div>
            );
          })
        }
        <div className="button-box">
          <Button className="add-answer-button" onClick={() => { addAnswer(category) }}>
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
        <Button className="add-answer-button" onClick={addCategory}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; C &nbsp; A &nbsp; T &nbsp; E &nbsp; G &nbsp; O &nbsp; R &nbsp; Y
        </Button>
      </div>
    </div>
  )
}

export default CategoriseBuildComponent
