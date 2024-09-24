import React, { useEffect } from 'react'
import Discussion from './Discussion'
import Game from './Game'
import { useState } from 'react'
const Landing = () => {
  const [members,setMembers] = useState([]);
  return (
    <div className='flex bg-slate-900 justify-between'>
      <Game/>
      <Discussion/>
    </div>
  )
}

export default Landing