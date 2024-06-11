import React from "react";
import Sidebar from "@/components/Sidebar"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[20%] h-full">
        <Sidebar />
      </div>
      <div className="w-[80%] bg-[#F1F8FF] h-full overflow-hidden">{children}</div>
    </div>
  );
};

export default layout;
