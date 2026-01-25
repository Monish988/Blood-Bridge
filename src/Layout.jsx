import React from 'react'
import { Outlet } from 'react-router-dom'
import Left from './Components/DashBoard/Left'

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Left />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
