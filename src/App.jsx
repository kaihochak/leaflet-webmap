import { useState } from 'react'
import './App.css'
import MapComponent from '@/components/shared/MapComponent'
import SideBar from '@/components/shared/SideBar'
import EditMode from './components/shared/EditMode'

function App() {
  const [mode, setMode] = useState('point')

  return (
    <>
      <div className='w-full h-full' >
        
        <div id="main-container">
          <MapComponent mode={mode} setMode={setMode}/>
          <EditMode mode={mode} setMode={setMode}/>
        </div>
        
        <SideBar/>
      </div>
    </>
  )
}

export default App
