import React, { useState } from 'react'
import './App.css'
import MapComponent from '@/components/shared/MapComponent'
import SideBar from '@/components/shared/SideBar'
import EditMode from './components/shared/EditMode'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { MARKERS } from '@/config/mapConfig';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

function App() {
  const [textMode, setTextMode] = useState(true)
  const [features, setFeatures] = useState([])

  return (
    <>
      <div className='w-full h-full' >

        {/* Main Component */}
        <div id="main-container">
          <MapComponent textMode={textMode} features={features} setFeatures={setFeatures}/>
          <EditMode textMode={textMode} setTextMode={setTextMode}/>
        </div>

        {/* Sidebar */}
        <SideBar features={features}/>
      </div>
    </>
  )
}

export default App
