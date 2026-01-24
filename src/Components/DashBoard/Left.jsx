import { Droplets, CircleUser, LogOut } from "lucide-react";
import React from "react";

const Left = () => {
  return (
    <div className="
      w-full
      lg:w-1/5
      min-h-screen
      px-6
      bg-white
    ">
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
      <div className="flex flex-col px-4 gap-4 py-6">
        {[
          "Dashboard",
          "Donors",
          "Hospitals",
          "Inventory",
          "Blood Requests",
          "Register as Donor",
        ].map((item) => (
          <a
            key={item}
            href="/"
            className="text-gray-500 text-lg hover:text-red-500"
          >
            {item}
          </a>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="mt-auto bg-gray-100 flex items-center justify-between gap-3 py-3 px-4 rounded-2xl">
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
