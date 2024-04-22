import React, { useState } from 'react'
import './App.css'
import MapComponent from '@/components/shared/MapComponent'
import SideBar from '@/components/shared/SideBar'
import EditMode from './components/shared/EditMode'

function App() {
  const [textMode, setTextMode] = useState(true)
  const [features, setFeatures] = useState([])
  const [editDetails, setEditDetails] = useState({ id: null, newText: '' });
  
  return (
    <>
      <div className='w-full h-full' >

        {/* Main Component */}
        <div id="main-container">
          <MapComponent 
            textMode={textMode} 
            editDetails={editDetails} 
            features={features}
            setFeatures={setFeatures}
          />
          <EditMode textMode={textMode} setTextMode={setTextMode}/>
        </div>

        {/* Sidebar */}
        <SideBar features={features} setEditDetails={setEditDetails}/>
      </div>
    </>
  )
}

export default App
