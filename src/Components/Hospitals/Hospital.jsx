import React from "react";
import SearchBarHospital from "./SearchBarHospital";
import { Plus } from "lucide-react";
import HospitalCard from "./HospitalCard";

const Hospital = (props) => {
  const data = props.props
  return (
    <div
      className="
      flex-1
      bg-gray-100
      max-h-screen
      overflow-y-scroll
      px-4 sm:px-6 lg:px-9
      py-6
      space-y-8 

    "
    >
      {/* TOP */}
      <div className=" flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Hospitals</h2>
          <p className="text-base text-gray-400">
            Manage partner hospitals and blood banks
          </p>
        </div>
        <div className=" cursor-pointer active:scale-95 select-none  text-white font-semibold flex items-center gap-7 bg-red-500 hover:bg-red-600 rounded-lg w-fit py-2 h-fit  px-4">
            <Plus size={18}/>
            <h3 className=" text-base">Add Hospital</h3>
        </div>
      </div>

      {/* CENTER */}
      <div>
        <SearchBarHospital />
      </div>

      {/* BOTTOM */}
      <div className=" flex gap-14 flex-wrap py-2"> 
        {data.map((elem,idx)=>{
          return <HospitalCard key={idx} name={elem.name} email={elem.email} phone={elem.phone} city={elem.city} license={elem.license} verified={elem.verified} />
        })}
    
      </div>
    </div>
  );
};

export default Hospital;
