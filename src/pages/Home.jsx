import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCounter, minusCounter } from '../redux/conuter/counterSlice'

function Home() {
  const { timer } = useSelector((state) => state.count)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>{timer}</h1>
      <button onClick={() => dispatch(addCounter())}>add</button>
      <button onClick={() => dispatch(minusCounter())}>minus</button>
    </div>
  )
}

export default Home