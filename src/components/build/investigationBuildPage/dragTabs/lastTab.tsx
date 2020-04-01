import React from 'react'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

export interface LastTabProps {
  columns: number
  isSynthesis: boolean
}

const LastTab: React.FC<LastTabProps> = ({columns, isSynthesis}) => {
  if (isSynthesis) {
    return <div className="last-tab"><FormatListBulletedIcon className="synthesis-tab-icon" /></div>
  }
  if (columns > 5) {
    return <div className="last-tab" style={{fontSize: '1.5vw'}}>+</div>;
  }
  return (
    <div className="last-tab">+ N E W &nbsp; Q U E S T I O N &nbsp; P A N E L</div>
  )
}

export default LastTab
