import React from 'react'
import DashBoard from './Components/DashBoard/DashBoard'
import Left from './Components/DashBoard/Left'
import Donor from './Components/Donor/Donor'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './Layout'
import donors from './donor'

 const App = () => {
  return (
    <div className=' flex '>
    <Left/>
    <Routes>
      <Route element={Layout}/>
      <Route path='/' element={<DashBoard/>}/>
      <Route path='/donors' element={<Donor props = {donors} />}/>
    </Routes>
    </div>
  )
}

export default App