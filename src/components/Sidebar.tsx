"use client"

import Logo from "./Logo";
import {
  People,
  Message2,
  Setting,
  Logout,
  ClipboardText,
} from "iconsax-react";
import { FaUserDoctor } from "react-icons/fa6";
import { AiFillMedicineBox } from "react-icons/ai";
import Navitem from "./Navitem";
import { useSideContext } from "@/context/Sidecontext";

const Sidebar = () => {
  const { value } = useSideContext();

  return (
    <div className="max-h-screen overflow-hidden">
      <div className="flex justify-center m-5">
        <Logo />
      </div>
      <div className="mt-3">
        <ul>
          <li>
            <a href="/dashboard/appointments">
              <Navitem
                isActive={value === "appointments" ? true : false}
                title="Appointments"
              >
                <ClipboardText size="24" />
              </Navitem>
            </a>
          </li>
          <li>
            <a href="/dashboard/doctors">
              <Navitem
                isActive={value === "doctors" ? true : false}
                title="Doctors"
              >
                <FaUserDoctor size={"24"} />
              </Navitem>
            </a>
          </li>
          <li>
            <a href="/dashboard/patients">
              <Navitem
                isActive={value === "patients" ? true : false}
                title="Patients"
              >
                <People size="24" />
              </Navitem>
            </a>
          </li>
          <li>
            <a href="/dashboard/medicine">
              <Navitem
                isActive={value === "medicine" ? true : false}
                title="Medicine Inventory"
              >
                <AiFillMedicineBox size="24" />
              </Navitem>
            </a>
          </li>
          <li>
            <a href="/dashboard/messages">
              <Navitem
                isActive={value === "messages" ? true : false}
                title="Messages"
              >
                <Message2 size="24" />
              </Navitem>
            </a>
          </li>
          <li>
            <a href="/dashboard/settings">
              <Navitem
                isActive={value === "settings" ? true : false}
                title="Settings"
              >
                <Setting size="24" />
              </Navitem>
            </a>
          </li>
        </ul>
      </div>
      <div className="p-5 flex items-center gap-2 cursor-pointer text-red-500 ">
        <Logout size="24" />
        <span className="block">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
