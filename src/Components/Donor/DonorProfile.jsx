import React, { useState, useEffect } from "react";
import { User, Calendar, Phone, Mail, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const DonorProfile = () => {
  const { user } = useAuth();
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        const res = await api.get("/api/donors");
        const userDonor = res.data.find(d => d.email === user?.email || d.userId === user?.id);
        if (userDonor) {
          setDonorData(userDonor);
          setUnavailableDates(userDonor.unavailableDates || []);
        }
      } catch (err) {
        console.error("Failed to fetch donor profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDonorProfile();
    }
  }, [user]);

  const toggleAvailability = async () => {
    if (!donorData) return;
    
    try {
      const res = await api.patch(`/api/donors/${donorData.id}/toggle`);
      setDonorData(res.data);
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  const saveUnavailableDates = async (updatedDates) => {
    try {
      const res = await api.patch(`/api/donors/${donorData.id}/unavailable-dates`, {
        unavailableDates: updatedDates
      });
      setDonorData(res.data);
    } catch (err) {
      console.error("Failed to save unavailable dates", err);
    }
  };

  const addUnavailableDate = async () => {
    if (!newDate || !reason) return;
    
    const dateEntry = {
      date: newDate,
      reason: reason,
      id: Date.now()
    };
    
    const updatedDates = [...unavailableDates, dateEntry];
    setUnavailableDates(updatedDates);
    await saveUnavailableDates(updatedDates);
    setNewDate("");
    setReason("");
  };

  const removeUnavailableDate = async (id) => {
    const updatedDates = unavailableDates.filter(d => d.id !== id);
    setUnavailableDates(updatedDates);
    await saveUnavailableDates(updatedDates);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!donorData) return <p>Donor profile not found</p>;

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-9 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-3xl mb-2">Donor Profile</h2>
          <p className="text-gray-400">Manage your donation availability</p>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">{donorData.name}</h3>
              <p className="text-gray-400">Blood Group: {donorData.bloodGroup}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{donorData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{donorData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{donorData.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <span>{donorData.gender}</span>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xl">Availability Status</h3>
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                donorData.available 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {donorData.available ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  Available
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  Unavailable
                </>
              )}
            </button>
          </div>
          <p className="text-gray-400">
            {donorData.available 
              ? "You are currently available for blood donation" 
              : "You are currently marked as unavailable for blood donation"}
          </p>
        </div>

        {/* Unavailability Dates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-xl mb-4">Unavailability Schedule</h3>
          
          {/* Add new date */}
          <div className="border-b pb-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Date"
              />
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Reason (e.g., travel, medical)"
              />
              <button
                onClick={addUnavailableDate}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Date
              </button>
            </div>
          </div>

          {/* List of dates */}
          <div className="space-y-2">
            {unavailableDates.length === 0 ? (
              <p className="text-gray-400">No unavailability dates scheduled</p>
            ) : (
              unavailableDates.map((dateEntry) => (
                <div key={dateEntry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{dateEntry.date}</span>
                    <span className="text-gray-400">- {dateEntry.reason}</span>
                  </div>
                  <button
                    onClick={() => removeUnavailableDate(dateEntry.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;