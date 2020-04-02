import React from 'react'


export interface LastTabProps {
  columns: number
  synthesis: string
  isSynthesis: boolean
}

const LastTab: React.FC<LastTabProps> = ({columns, synthesis, isSynthesis}) => {
  if (columns > 5) {
    return <div className="last-tab" style={{fontSize: '1.5vw'}}>+</div>;
  }
  return (
    <div className="last-tab">+ N E W &nbsp; Q U E S T I O N &nbsp; P A N E L</div>
  )
}

export default LastTab
