import React from 'react'
import { BiMenuAltRight } from "react-icons/bi";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const SideBar = () => {

  const Searchbar = () => {
    return (
      <div className='w-full'>
        <input type="text" placeholder="Search" />
      </div>
    )
  }

  return (
    <section id="sidebar">
      <Sheet>
        <SheetTrigger asChild>
          <button >
            <BiMenuAltRight className='text-[35px] text-primary'/>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}


export default SideBar
