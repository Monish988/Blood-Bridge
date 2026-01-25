import React from "react";
import SearchBar from "./SearchBar";
import { Users } from "lucide-react";
import DonorItem from "./DonorItem";


const Donor = () => {
  return (
    <div
      className="w-full  flex-1
      bg-gray-100
      px-4 sm:px-6 lg:px-9
      py-6
      space-y-8"
    >
      {/* TOP */}
      <div className=" flex justify-between items-center">
        <div>
        <h2 className="font-bold text-2xl">Donors</h2>
        <p className="text-sm text-gray-400">Manage registered blood donors</p>
        </div>
        <div className=" flex items-center gap-3">
            <div className=" text-xs bg-green-200 py-1 px-2 rounded-lg text-green-600 flex gap-1 items-center">
                <Users size={17}/>
                <p>6 total</p>
            </div>
            <div className=" text-xs bg-blue-200 py-1 px-2 rounded-lg text-blue-600">
               <p>4 Available</p>
            </div>
        </div>
      </div>

      {/* CENTER */}
      <div>
        <SearchBar/>
        
      </div>

      {/* BOTTOM */}
      <div>
        <div className=" font-semibold text-gray-500 grid grid-cols-6 gap-4 border-b border-b-gray-200 mb-2">
            <p>Donor</p>
            <p>Blood Group</p>
            <p>Contact</p>
            <p>Location</p>
            <p>Status</p>
            <p>Actions</p>
        </div>
        <div className=" space-y-1">
        <DonorItem/>
        <DonorItem/>
        </div>
      </div>
    </div>
  );
};

export default Donor;
