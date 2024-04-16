import React from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import { Input } from "@/components/ui/input"
import { IoCloseSharp } from "react-icons/io5";

const SideBar = () => {

  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const OpenSideBar = () => {
    return (
      <div className='flex-col flex-center gap-y-4'>

        {/* Search bar */}
        <div className='w-full flex-between gap-x-2'>
          <Input id="name" placeholder="Search" />
          {/* Close */}
          <button className="text-primary text-[35px] " onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IoCloseSharp/>
          </button>
        </div>

        {/* Search Results */}

      </div>

    )
  }

  return (
    <section>

      {/* close side bar */}
      <div id="sidebar-close" className={`${!sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <BiMenuAltRight className="text-3xl text-primary" />
        </button>
      </div>

      {/* open side bar */}
      <div id="sidebar-open" className={`${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <OpenSideBar />
      </div>
    </section>
  )
}


export default SideBar
