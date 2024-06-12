import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SideContextType {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const SideContext = createContext<SideContextType | undefined>(undefined);

export const SideProvider = ({ children }: { children: ReactNode }) => {

  const pathName = usePathname()

  useEffect(() => {
    switch (pathName) {
      case "/dashboard/appointments":
        setValue("appointments")
        break;
      case "/dashboard/doctors":
        setValue("doctors")
        break;
      case "/dashboard/patients":
        setValue("patients")
        break;
      case "/dashboard/medicine":
        setValue("medicine")
        break;
      case "/dashboard/messages":
        setValue("messages")
        break;
      case "/dashboard/settings":
        setValue("settings")
        break;
      default:
        setValue('')
        break;
    }
  } ,[])

  const [value, setValue] = useState<string>("");

  return (
    <SideContext.Provider value={{ value, setValue }}>
      {children}
    </SideContext.Provider>
  );
};

export const useSideContext = (): SideContextType => {
  const context = useContext(SideContext);
  if (context === undefined) {
    throw new Error("useSideContext must be used within a SideProvider");
  }
  return context;
};
