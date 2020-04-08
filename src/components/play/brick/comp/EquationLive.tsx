import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax'

import './EquationLive.scss';


interface EquationProps {
  component: any;
}

const EquationLive: React.FC<EquationProps> = ({ component }) => {
  if (!component.value) {
    return <div></div>;
  }

  return (
    <div>
      <MathJax.Provider>
        <MathJax.Node formula={component.value} />
      </MathJax.Provider>
    </div>
  );
}

export default EquationLive;
