import React from "react"

const Navitem = ({ children, isActive, title } : {children: React.ReactNode, isActive: boolean, title: string}) => {

  

  return (
    <div className={`${isActive ? "p-5 flex items-center gap-2 bg-[#3497F920] border-l-4 border-l-[#3497F9] cursor-pointer text-[#3497F9]" : "p-5 flex items-center gap-2 cursor-pointer text-[#7f8f98]"}`}>{children}<span className={`${isActive ? "block" : "block"}`}>{title}</span></div>
  )
}

export default Navitem