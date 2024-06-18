
import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar"
import { SideProvider } from "@/context/Sidecontext";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[20%] h-full">
        <SideProvider>
          <Sidebar />
        </SideProvider>
      </div>
      <div className="w-[80%] bg-[#F1F8FF] h-screen">{children}</div>
    </div>
  );
};

export default layout;
