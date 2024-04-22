import React from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import SearchSidebar from '@/components/shared/SearchSidebar'

const SideBar = ({ features, setEditDetails }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  /************************************************************
   * Rendering
   ************************************************************/
  return (
    <section>
      {/* close side bar */}
      <div id="sidebar-close" className={`${!sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <BiMenuAltRight className="text-3xl text-primary-dark" />
        </button>
      </div>

      {/* open side bar */}
      <div id="sidebar-open" className={`${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <SearchSidebar 
          features={features} 
          setEditDetails={setEditDetails}
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </section>
  )
}

export default SideBar
