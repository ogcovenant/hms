import Logo from "./Logo";
import { People, Message2, Setting, Logout, ClipboardText } from "iconsax-react";
import { FaUserDoctor } from "react-icons/fa6";
import { AiFillMedicineBox } from "react-icons/ai";
import Navitem from "./Navitem";

const Sidebar = () => {
  return (
    <div className="">
      <div className="flex justify-center m-5">
        <Logo />
      </div>
      <div className="mt-3">
        <ul>
          <li>
            <Navitem isActive={true} title="Appointments">
              <ClipboardText size="24" />
            </Navitem>
          </li>
          <li>
            <Navitem isActive={false} title="Doctors">
              <FaUserDoctor size={"24"} />
            </Navitem>
          </li>
          <li>
            <Navitem isActive={false} title="Patients">
              <People size="24" />
            </Navitem>
          </li>
          <li>
            <Navitem isActive={false} title="Medicine Inventory">
              <AiFillMedicineBox size="24" />
            </Navitem>
          </li>
          <li>
            <Navitem isActive={false} title="Messages">
              <Message2 size="24" />
            </Navitem>
          </li>
          <li>
            <Navitem isActive={false} title="Settings">
              <Setting size="24" />
            </Navitem>
          </li>
        </ul>
      </div>
      <div
        className="p-5 flex items-center gap-2 cursor-pointer text-red-500 ">
        <Logout size="24" />
        <span className="block">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
