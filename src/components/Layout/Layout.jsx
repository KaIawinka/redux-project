import React from 'react'
import Footer from '../Footer'
import Header from '../Header'
import { Outlet } from 'react-router-dom'
import axios from 'axios'

function Layout() {
  return (
    <div>
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout