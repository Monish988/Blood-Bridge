import { Droplets } from "lucide-react";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
import React from "react";

const Left = () => {
  return (
    <div className=" h-screen w-1/5 px-6">
      {/* TOP */}
      <div className=" flex items-center justify-start gap-4 py-6  border-b border-gray-200">
        <div className=" shadow-xl text-white text-center bg-red-500 w-fit p-3 rounded-2xl">
          <Droplets size={32} />
        </div>
        <div>
          <h3 className=" text-2xl font-extrabold">Blood Bridge</h3>
          <p className=" text-sm text-gray-500">Connecting Lives</p>
        </div>
      </div>

      {/* CENTER */}
      <div className=" flex flex-col items-start px-8 gap-6 py-8">
        <a href="/" className=" text-gray-500 text-lg">
          Dashboard
        </a>
        <a href="/" className=" text-gray-500 text-lg">
          Donors
        </a>
        <a href="/" className=" text-gray-500 text-lg">
          Hospitals
        </a>
        <a href="/" className=" text-gray-500 text-lg">
          Inventory
        </a>
        <a href="/" className=" text-gray-500 text-lg">
          Blood Requests
        </a>
        <a href="/" className=" text-gray-500 text-lg">
          Register as Donor
        </a>
      </div>

      {/* BOTTOM */}
      <div className=" bg-gray-100 flex items-center mt-105 justify-between gap-3 py-2 px-4 rounded-2xl">
        <div className=" flex gap-4 items-center ">
          <div className=" bg-gray-900 text-white w-fit h-fit rounded-full">
            <CircleUser size={32} strokeWidth={3} />
          </div>

          <div>
            <h4 className=" font-semibold">User</h4>
            <p className=" text-xs text-gray-400">Email</p>
          </div>
        </div>
        <div className=" text-gray-400">
          <LogOut />
        </div>
      </div>
    </div>
  );
};

export default Left;
