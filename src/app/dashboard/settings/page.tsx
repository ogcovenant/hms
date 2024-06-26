"use client"

import Dashtab from "@/components/Apptab"
import { columns } from "@/components/Apptab"
import { Appointment } from "@/components/Apptab"
import { appointments } from "@/components/Apptab"
import { Button } from "@/components/ui/button"
import { Add } from "iconsax-react"


async function getData(): Promise<Appointment[]> {
  return appointments
}

const page = async() => {

  const data = await getData()

  return (
    <div className="p-10 overflow-auto">
      <div className="flex items-center justify-between gap-5">
      <h1 className="text-2xl text-[#374858]">Appointments</h1>
      <Button className="bg-[#3497F9] active:bg-[#3497F9] hover:bg-[#3497F9]"><Add size="24" color="#FFF"/><span>Add</span></Button>
      </div>
      <div className=" bg-white mt-3 p-5 rounded-md">
        <div className="">
          <Dashtab columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}

export default page