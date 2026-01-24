import React from "react";
import RightCard from "./RightCard";
import { Circle, Users } from 'lucide-react'
import { Activity } from 'lucide-react'
import { Droplet } from 'lucide-react'
import { CircleAlert } from 'lucide-react' 
import { Building2 } from "lucide-react";
import { Clock } from "lucide-react";

const Right = () => {
  return (
    <div className=" h-screen w-4/5 bg-gray-100  py-17 px-9 space-y-8">
      {/* SECTION 1 */}
      <div>
          <h2 className=" font-bold text-2xl">Dashboard</h2>
          <p className=" text-sm text-gray-400">Real-time overview of blood bank operations</p>
      </div>

      {/* SECTION 2 */}
      <div className=" flex justify-between">
          <RightCard count={6} icon={Users} title="Total Donors" color={'bg-red-500'}/>
          <RightCard count={4} icon={Activity} title="Active Donors" color={'bg-green-500'}/>
          <RightCard count={2} icon={Droplet} title="New Donors" color={'bg-blue-500'}/>
          <RightCard count={3} icon={CircleAlert} title="Pending Requests" color={'bg-yellow-500'}/>
      </div>
      {/* SECTION 3 */}
      <div className=" flex space-x-10 ">
        <div className=" shadow-lg w-149 rounded-lg h-80 bg-white">

        </div>
        <div className=" shadow-lg w-149 rounded-lg h-80 bg-white">

        </div>
      </div>

      {/* SECTION 4 */}
      <div className=" bg-white p-5 rounded-lg">
          <div className=" flex items-center gap-3  px-4 py-3">
            <CircleAlert size={25} className=" text-red-500"/>
            <h2 className="font-bold text-lg">Recent Blood Requests</h2>
          </div>
          <div className=" bg-gray-100 p-5 rounded-lg space-y-2">
            <div className="  flex gap-3 items-center ">
              <h2 className=" text-red-500 font-bold text-2xl">AB+</h2>
              <div className=" flex items-center gap-3">
              <p className=" py-1 text-sm px-2 rounded bg-amber-50 text-amber-600">High</p>
              <p className=" py-1 text-sm px-2 rounded bg-blue-300 text-blue-600">Pending</p>
              </div>
            </div>
            <div className=" flex gap-3 text-sxm items-center text-gray-500">
              <Building2 size={18} />
              <p>Regional Medical Center</p>
            </div>
            <div className=" flex gap-3 text-gray-500 items-center  text-sm ">
              <p >2 units needed</p>
              <div className=" flex items-center gap-2">
              <Clock size={14} />
              <p>Jan 24, 12:33 PM</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Right;
