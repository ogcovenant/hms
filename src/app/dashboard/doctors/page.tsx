"use client"

import DocTab from "@/components/Doctab"
import { columns } from "@/components/Doctab"
import { Doctor } from "@/components/Doctab"
import { Doctors } from "@/components/Doctab"
import { Button } from "@/components/ui/button"
import { Add } from "iconsax-react"
import { useState } from "react"


async function getData() {
  return Doctors
}

const page = async() => {

  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen)
  }

  const data = await getData()

  return (
    <div className="p-10 overflow-auto">
      <div className="flex items-center justify-between gap-5">
      <h1 className="text-2xl text-[#374858]">Doctors</h1>
      <Button className="bg-[#3497F9] active:bg-[#3497F9] hover:bg-[#3497F9]" onClick={() => handleMenuOpen()}><Add size="24" color="#FFF"/><span>Add</span></Button>
      </div>
      <div className=" bg-white mt-3 p-5 rounded-md">
        <div className="">
          <DocTab columns={columns} data={data} />
        </div>
      </div>
      {
        menuOpen && (
          <div className="bg-[#00000060] w-full h-screen">
            <div className="bg-white"></div>
          </div>
        )
      }
    </div>
  )
}

export default page