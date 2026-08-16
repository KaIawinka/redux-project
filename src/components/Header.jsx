import React, { useState } from 'react'

function Header() {

  const [num, setNum] = useState(1)

  function count(){
    setNum(num + 1)
  }
  return (
    <div>
        <h1>{num}</h1>
        <button onClick={count}>f</button>
    </div>
  )
}

export default Header