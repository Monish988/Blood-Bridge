import { Droplets, CircleUser, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import React from "react";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Donors", path: "/donors" },
  { label: "Hospitals", path: "/hospitals" },
  { label: "Inventory", path: "/inventory" },
  { label: "Blood Requests", path: "/requests" },
  { label: "Register as Donor", path: "/register-donor" },
];

const Left = () => {
  return (
    <div
      className="
      w-full
      lg:w-1/5
      min-h-screen
      px-6
      bg-white
      flex
      flex-col
    "
    >
      {/* TOP */}
      <div className="flex items-center gap-4 py-6 border-b border-gray-200">
        <div className="shadow-xl text-white bg-red-500 p-3 rounded-2xl">
          <Droplets size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">Blood Bridge</h3>
          <p className="text-sm text-gray-500">Connecting Lives</p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex flex-col px-4 gap-4 py-6 flex-1">
        {navItems.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `text-lg transition ${
                isActive
                  ? "text-red-500 font-semibold"
                  : "text-gray-500 hover:text-red-500"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="bg-gray-100 flex items-center justify-between gap-3 py-3 mb-3 px-4 rounded-2xl">
        <div className="flex gap-4 items-center">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <CircleUser size={28} />
          </div>
          <div>
            <h4 className="font-semibold">User</h4>
            <p className="text-xs text-gray-400">Email</p>
          </div>
        </div>
        <LogOut className="text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default Left;
