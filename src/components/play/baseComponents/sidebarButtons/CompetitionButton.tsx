import React from 'react';

interface ButtonProps {
  sidebarRolledUp: boolean;
  onClick(): void;
}

const CompetitionButton: React.FC<ButtonProps> = (props) => {
  if (props.sidebarRolledUp) {
    return <span />
  }

  return (
    <button onClick={props.onClick} className="assign-class-button svgOnHover blue">
      <span>Create competition</span>
    </button>
  );
}

export default CompetitionButton;
