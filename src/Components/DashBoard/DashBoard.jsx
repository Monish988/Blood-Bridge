import React, { useEffect, useState } from "react";
import Right from "./Right";
import axios from "axios";

const DashBoard = () => {
  const [stats, setStats] = useState({
    totalDonors:0,
    availableDonors:0,
    BloodUnits:0,
    PendingRequests:0

  })
  useEffect(()=>{
    const getStats = async ()=>{
      const res = await axios.get("http://localhost/5000/api/stats");
    }
  })
  return <Right />;
};

export default DashBoard;
