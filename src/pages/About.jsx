import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function About() {
	const dispatch = useDispatch()
	const { list } = useSelector((state) => state.todo)
  return (
    <>

    </>
  )
}

export default About