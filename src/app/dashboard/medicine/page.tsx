"use client"

import { Button } from "@/components/ui/button"
import { Add } from "iconsax-react"
import { useState } from "react"
import { FaXmark } from "react-icons/fa6"

const page = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuDisplay = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
      <div className="p-10 overflow-auto">
      <div className="flex items-center justify-between gap-5">
      <h1 className="text-2xl text-[#374858]">Medicine Inventory</h1>
      <Button className="bg-[#3497F9] active:bg-[#3497F9] hover:bg-[#3497F9]" onClick={handleMenuDisplay}><Add size="24" color="#FFF"/><span>Add</span></Button>
      </div>
      <div className=" bg-white mt-3 p-5 rounded-md">
        <div className="">
          
        </div>
      </div>
    </div>
    {
      menuOpen ? (
        <div className="absolute w-full h-full top-0 left-0 bg-[#00000060] flex justify-center items-center">
          <div className="bg-white w-[35%] rounded-md p-6">
            <div className="flex justify-between">
            <p className="text-2xl">Add a new medicine</p>
            <p onClick={handleMenuDisplay} className="cursor-pointer"><FaXmark size={28} /></p>
            </div>
            <div className="mt-5">
              <form>
                <div className="flex flex-col gap-1">
                  <label htmlFor="name">Medicine Name</label>
                  <input type="text" id="name" name="name" className="border-2 p-2 rounded-md w-full"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null
    }
    </>
  )
}

export default page