import React from 'react'

export interface LastTabProps {
  columns: number
}

const LastTab: React.FC<LastTabProps> = ({columns}) => {
  if (columns > 2) {
    return <div className="last-tab">+</div>;
  }
  return (
    <div className="last-tab">+ N E W &nbsp; Q U E S T I O N &nbsp; P A N E L</div>
  )
}

export default LastTab
