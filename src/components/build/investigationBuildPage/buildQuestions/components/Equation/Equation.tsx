import React from 'react'
import './Equation.scss'

export interface EquationComponentProps {
  index: number,
  data: any,
  cleanComponent(): void
  updateComponent(component: any, index: number): void
}

const EquationComponent: React.FC<any> = () => {

  return (
    <div className="question-build-text-editor">
    </div>
  );
}

export default EquationComponent
