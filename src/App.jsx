import React, { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import myRouter from './router'


import './App.css'

function App() {


  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  )
}

export default App
