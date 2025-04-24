import React from 'react'

const Tags = ({title, color}) => {
  return (
    <div className={`w-20 h-20 ${color} text-white rounded-md flex justify-center items-center`} >
      {title}
    </div>
  )
}

export default Tags
