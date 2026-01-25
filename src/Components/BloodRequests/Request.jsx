import React from "react";
import { Plus, CircleCheckBig, Building2, Phone,Clock,Bell,CircleX } from "lucide-react";
import { useState } from "react";
import { RequestItem } from "./RequestItem";
const Request = () => {
  const tabs = [
    { label: "All", count: 7 },
    { label: "Pending", count: 5 },
    { label: "Fulfilled", count: 2 },
    { label: "Cancelled" },
  ];

  const [active, setActive] = useState("Pending");

  return (
    <div
      className="flex-1
      bg-gray-100
      px-4 sm:px-6 lg:px-9
      py-6"
    >
      {/* SECTION 1 */}
      <div className=" flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Blood Requests</h2>
          <p className="text-base text-gray-400">
            Manage emergency blood requests
          </p>
        </div>
        <div className=" cursor-pointer active:scale-95 select-none  text-white font-semibold flex items-center gap-7 bg-red-500 hover:bg-red-600 rounded-lg w-fit py-2 h-fit  px-4">
          <Plus size={18} />
          <h3 className=" text-base">New Request</h3>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className=" mt-10">
        <div className="flex gap-2 bg-gray-200 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActive(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 text-base rounded-lg transition
        ${
          active === tab.label
            ? "bg-white shadow font-medium text-gray-900"
            : "text-gray-500 hover:bg-white"
        }
      `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3 */}
      <div className=" mt-10 space-y-4">
        <RequestItem/>
        <RequestItem/>
        <RequestItem/>
        <RequestItem/>
      </div>
    </div>
  );
};

export default Request;
