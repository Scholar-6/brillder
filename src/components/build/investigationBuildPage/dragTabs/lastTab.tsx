import React from 'react'

export interface LastTabProps {
  label: string
}

const LastTab: React.FC<LastTabProps> = ({label}) => {
  return (
    <div className="last-tab">{label}</div>
  )
}

export default LastTab
