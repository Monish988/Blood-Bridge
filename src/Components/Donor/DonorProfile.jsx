import React, { useState, useEffect } from "react";
import { User, Calendar, Phone, Mail, Droplet, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const DonorProfile = () => {
  const { user } = useAuth();
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        if (user?.email) {
          const res = await api.get(`/donors/profile/${user.email}`);
          setDonorData(res.data);
          setUnavailableDates(res.data.unavailableDates || []);
          setIsAvailable(res.data.available || false);
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
      const res = await api.patch(`/donors/${donorData.id}/toggle`);
      setDonorData(res.data);
      setIsAvailable(res.data.available);
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  const addUnavailableDate = async () => {
    if (!newDate || !reason) {
      alert("Please fill in both date and reason");
      return;
    }
    
    const dateEntry = {
      date: newDate,
      reason: reason,
      id: Date.now()
    };
    
    const updatedDates = [...unavailableDates, dateEntry];
    setUnavailableDates(updatedDates);
    
    try {
      await api.patch(`/donors/${donorData.id}/unavailable-dates`, {
        unavailableDates: updatedDates
      });
    } catch (err) {
      console.error("Failed to save unavailable dates", err);
    }
    
    setNewDate("");
    setReason("");
  };

  const removeUnavailableDate = async (id) => {
    const updatedDates = unavailableDates.filter(d => d.id !== id);
    setUnavailableDates(updatedDates);
    
    try {
      await api.patch(`/donors/${donorData.id}/unavailable-dates`, {
        unavailableDates: updatedDates
      });
    } catch (err) {
      console.error("Failed to update unavailable dates", err);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!donorData) return <p className="p-6">Donor profile not found. Please complete your profile during signup.</p>;

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-3 md:px-6 lg:px-9 py-4 md:py-6 page-load-animation">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">Donor Profile</h2>
          <p className="text-sm md:text-base text-gray-400">Manage your donation availability and history</p>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-xl">{donorData.name}</h3>
              <p className="text-sm md:text-base text-gray-400">Blood Group: {donorData.bloodGroup}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm md:text-base truncate">{donorData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm md:text-base">{donorData.phone}</span>
            </div>
          </div>
        </div>

        {/* Donation Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Droplet className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-400">Total Donations</p>
                <p className="text-2xl md:text-3xl font-bold text-red-600">{donorData.donationCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-400">Last Donation</p>
                <p className="text-sm md:text-base font-semibold">
                  {donorData.lastDonationDate 
                    ? new Date(donorData.lastDonationDate).toLocaleDateString() 
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 md:mb-4 flex-wrap gap-2">
            <h3 className="font-semibold text-base md:text-xl">Availability Status</h3>
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                isAvailable
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isAvailable ? (
                <>
                  <ToggleRight className="w-4 h-4 md:w-5 md:h-5" />
                  Available
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 md:w-5 md:h-5" />
                  Unavailable
                </>
              )}
            </button>
          </div>
          <p className="text-sm md:text-base text-gray-400">
            {isAvailable 
              ? "You are currently available for blood donation" 
              : "You are currently marked as unavailable for blood donation"}
          </p>
        </div>

        {/* Unavailability Dates */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="font-semibold text-base md:text-xl mb-3 md:mb-4">Unavailability Schedule</h3>
          
          {/* Add new date */}
          <div className="border-b pb-3 md:pb-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-2 md:px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                placeholder="Date"
              />
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="px-2 md:px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                placeholder="Reason (e.g., travel, medical)"
              />
              <button
                onClick={addUnavailableDate}
                className="bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                Add Date
              </button>
            </div>
          </div>

          {/* List of dates */}
          <div className="space-y-2">
            {unavailableDates.length === 0 ? (
              <p className="text-sm md:text-base text-gray-400">No unavailability dates scheduled</p>
            ) : (
              unavailableDates.map((dateEntry) => (
                <div key={dateEntry.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">{dateEntry.date}</span>
                    <span className="text-xs md:text-sm text-gray-400 truncate">- {dateEntry.reason}</span>
                  </div>
                  <button
                    onClick={() => removeUnavailableDate(dateEntry.id)}
                    className="text-red-600 hover:text-red-700 text-xs md:text-sm flex-shrink-0"
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