import React from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import { Input } from "@/components/ui/input"
import { IoCloseSharp } from "react-icons/io5";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const SideBar = ({ features }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)


  // Feature Card for each feature
  const FeatureCard = ({ feature }) => {

    let lat = feature._latlng.lat;
    let lng = feature._latlng.lng;

    return (
      <div className='py-2 flex-between gap-x-4'>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="pb-2 flex-between">
                <p>Feature #{feature._leaflet_id}</p>
                <Badge className={`${feature.type === "polyline" ? "bg-secondary" : feature.type === "polygon" ? "bg-accent" : ""}`}>{feature.type}</Badge>
            </CardTitle>
            <CardDescription className="flex-between">
              <div className='flex gap-x-2'>
                <p>📍</p>
                <p>{lat.toString().substring(0, 10)}</p>
                <p>{lng.toString().substring(0, 10)} </p>
              </div>
              <Button variant="outline" size="icon">Copy</Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              {feature.text ?
                <Label htmlFor="text">{feature.text}</Label>
                : <div className="flex flex-col space-y-1.5">
                  <Input id="text" placeholder="Add a text" />
                </div>}
            </div>
          </CardContent>
          {/* <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter> */}
        </Card>
      </div>
    )
  }

  // Search Results for each feature
  const SearchResults = () => {
    return (
      <div className='flex-col gap-y-4 '>
        {Object.values(features).flat().length === 0 ?
          <p>No results found</p>
          : Object.values(features).flat().map((feature, index) => <FeatureCard key={index} feature={feature} />)
        }
      </div>
    )
  }

  // Sidebar when it's open
  const OpenSideBar = () => {
    return (
      <div className='relative flex-col flex-center gap-y-4'>

        {/* Search bar */}
        <div className='sticky w-full pt-2 pb-6 pl-8 pr-4 top-4 flex-between gap-x-2'>
          <Input id="name" placeholder="Search" className="h-14 w-[350px] border-2" />
          {/* Close */}
          <button className="text-primary-dark text-[23px] " onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IoCloseSharp />
          </button>
        </div>

        {/* Search Results */}
        <SearchResults />
      </div>

    )
  }


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
        <OpenSideBar />
      </div>
    </section>
  )
}


export default SideBar
