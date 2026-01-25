import React from "react";
import { Plus } from "lucide-react";
import Unit from "./Unit";
import { Package } from "lucide-react";
import InventoryItem from "./InventoryItem";

const Inventory = () => {
  return (
    <div
      className="
      flex-1
      bg-gray-100
      px-4 sm:px-6 lg:px-9
      py-6"
    >
      {/* SECTION 1 */}
      <div className=" flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Blood Inventory</h2>
          <p className="text-base text-gray-400">
            Track blood units across all hospitals
          </p>
        </div>
        <div className=" cursor-pointer active:scale-95 select-none  text-white font-semibold flex items-center gap-7 bg-red-500 hover:bg-red-600 rounded-lg w-fit py-2 h-fit  px-4">
          <Plus size={18} />
          <h3 className=" text-base">Update Inventory</h3>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className=" grid grid-cols-7 gap-10 mt-10">
        <Unit />
        <Unit />
        <Unit />
        <Unit />
        <Unit />
        <Unit />
        <Unit />
      </div>

      {/* SECTION 3 */}
      <div className=" bg-red-500 rounded-lg flex items-center justify-between py-8 px-5 mt-10">
        <div className=" flex text-white gap-5">
          <div className=" bg-white/20 rounded-lg py-4 px-6 w-fit flex items-center  text-white">
            <Package size={40} />
          </div>
          <div className=" flex items-start flex-col gap-2">
            <h2 className=" text-xl text-white/90">
              Total Blood Units Available
            </h2>
            <h1 className=" text-5xl font-bold">88</h1>
          </div>
        </div>
        <div>
          <div className=" text-white flex flex-col items-end">
            <h2 className=" text-xl text-white/90">Across</h2>
            <h1 className=" text-4xl font-bold">4 Hospitals</h1>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className=" mt-10">
        <div className=" ">
          <h3 className=" font-bold text-2xl">Detailed Inventory</h3>
        </div>
        <div className=" border-t border-t-gray-300 mt-4 grid grid-cols-7 px-2 py-2 text-gray-500 text-lg bg-white">
          <h3>Hospital</h3>
          <h3>Blood Group</h3>
          <h3>Units Available</h3>
          <h3>Status</h3>
          <h3>Expiry Date</h3>
          <h3>Last Updated</h3>
          <h3>Actions</h3>
        </div>
        <div
          className=" max-h-screen
      overflow-y-scroll"
        >
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
          <InventoryItem />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
