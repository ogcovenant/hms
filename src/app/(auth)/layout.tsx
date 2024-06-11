import React from "react";
import Logo from "@/components/Logo";


const layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <div className="hidden xl:block w-1/2 bg-[#3399cc] p-12">
        <Logo />
        <div>
          <img src="/images/wave.gif" alt="A doctor waving" />
        </div>
      </div>
      <div className="w-full xl:w-1/2">{children}</div>
    </div>
  );
};

export default layout;
