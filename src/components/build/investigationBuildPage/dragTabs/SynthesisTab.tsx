import React from 'react'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';


export interface SynthesisTabProps {
  columns: number
  synthesis: string
  isSynthesis: boolean
}

const SynthesisTab: React.FC<SynthesisTabProps> = ({columns, synthesis, isSynthesis}) => {
  return (
    <div className="last-tab">
      <img alt="add-synthesis" src="/images/synthesis-icon.png" className="synthesis-tab-icon" />
    </div>
  );
}

export default SynthesisTab
