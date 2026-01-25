import React from 'react'
import DashBoard from './Components/DashBoard/DashBoard'
import Left from './Components/DashBoard/Left'
import Donor from './Components/Donor/Donor'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './Layout'
import donors from './donor'
import Hospital from './Components/Hospitals/Hospital'
import { hospitals } from './hospitals'
import Inventory from './Components/Inventory/Inventory'

 const App = () => {
  return (
    <div className=' flex '>
    <Left/>
    <Routes>
      <Route element={Layout}/>
      <Route path='/' element={<DashBoard/>}/>
      <Route path='/donors' element={<Donor props = {donors} />}/>
      <Route path='/hospitals' element={<Hospital props={hospitals}/>}/>
      <Route path='/inventory' element={<Inventory/>}/>
    </Routes>
    </div>
  )
}

export default App