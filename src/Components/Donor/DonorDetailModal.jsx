import React from "react";
import { X, User, Mail, Phone, MapPin, Droplet, Calendar, Heart } from "lucide-react";
import Modal from "../Modal";

const DonorDetailModal = ({ isOpen, onClose, donor }) => {
  if (!donor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="min-w-96 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <h2 className="text-xl md:text-2xl font-bold">Donor Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">{donor.name}</h3>
            <p className="text-sm md:text-base text-gray-400">{donor.gender}</p>
          </div>
        </div>

        {/* Blood Group */}
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
          <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Droplet className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-400">Blood Group</p>
            <p className="text-lg md:text-xl font-bold text-red-600">{donor.bloodGroup}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base md:text-lg">Contact Information</h4>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm md:text-base truncate">{donor.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm md:text-base">{donor.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">City</p>
              <p className="text-sm md:text-base">{donor.city}</p>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base md:text-lg">Availability</h4>
          
          <div className={`p-3 rounded-lg ${donor.available ? 'bg-green-50' : 'bg-gray-50'}`}>
            <p className={`text-sm md:text-base font-semibold ${donor.available ? 'text-green-700' : 'text-gray-600'}`}>
              {donor.available ? '✓ Available for donation' : '✗ Currently unavailable'}
            </p>
          </div>
        </div>

        {/* Donation History */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base md:text-lg">Donation History</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Donations</p>
                <p className="text-lg font-bold text-blue-600">{donor.donationCount || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Last Donation</p>
                <p className="text-xs md:text-sm font-bold text-purple-600">
                  {donor.lastDonationDate 
                    ? new Date(donor.lastDonationDate).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-400">Verification Status</p>
          <p className={`text-sm md:text-base font-semibold ${donor.verified ? 'text-blue-700' : 'text-gray-600'}`}>
            {donor.verified ? '✓ Verified Donor' : 'Pending Verification'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DonorDetailModal;
