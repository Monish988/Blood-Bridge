import React from 'react'
import { Outlet } from 'react-router-dom'
import Left from './Components/DashBoard/Left'

const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-y-hidden w-full">
      <Left />
      <main className="flex-1 overflow-x-hidden overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
