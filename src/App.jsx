import { useState } from 'react'
import './App.css'
import MapComponent from '@/components/shared/MapComponent'
import SideBar from '@/components/shared/SideBar'

function App() {
  return (
    <>
      <div className='flex w-full'>
        <SideBar/>
        <MapComponent/>
      </div>
    </>
  )
}

export default App
