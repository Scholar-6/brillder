import React from 'react';

declare var Brillder: any;

interface ButtonProps {
  competitionPresent: boolean | null;
  sidebarRolledUp: boolean;
  onClick(): void;
  onDownload(): void;
}

const CompetitionButton: React.FC<ButtonProps> = (props) => {
  if (props.sidebarRolledUp || props.competitionPresent === null) {
    return <span />
  }

  if (props.competitionPresent) {
    return <button onClick={props.onDownload} className="assign-class-button two-line-button svgOnHover blue">
      <span>Download Competition pdf</span>
    </button>
  }

  return (
    <button onClick={props.onClick} className="assign-class-button two-line-button svgOnHover blue">
      <span>Launch Competition</span>
    </button>
  );
}

export default CompetitionButton;
