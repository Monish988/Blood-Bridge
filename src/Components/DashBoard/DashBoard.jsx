import React from "react";
import Left from "./Left";
import Right from "./Right";

const DashBoard = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Left />
      <Right />
    </div>
  );
};

export default DashBoard;
