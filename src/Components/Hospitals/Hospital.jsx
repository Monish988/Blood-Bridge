import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import HospitalCard from "./HospitalCard";
import SearchBarHospital from "./SearchBarHospital";
import api from "../../services/api";

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  useEffect(() => {
  document.body.style.overflow = open || editOpen ? "hidden" : "auto";
  return () => (document.body.style.overflow = "auto");
}, [open, editOpen]);

  const openEditModal = (hospital) => {
    setEditingHospital(hospital);
    setForm({
      name: hospital.name,
      email: hospital.email,
      phone: hospital.phone,
      city: hospital.city,
      license: hospital.license,
    });
    setEditOpen(true);
  };
  const updateHospital = async () => {
    try {
      const res = await api.patch(`/api/hospitals/${editingHospital.id}`, form);

      setHospitals((prev) =>
        prev.map((h) => (h.id === editingHospital.id ? res.data : h)),
      );

      setEditOpen(false);
      setEditingHospital(null);
    } catch (err) {
      console.error("Failed to update hospital", err);
    }
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    license: "",
  });

  // disable background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get("/api/hospitals");
        setHospitals(res.data);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const deleteHospital = async (id) => {
    try {
      await api.delete(`/api/hospitals/${id}`);
      setHospitals((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to delete hospital", err);
    }
  };

  const addHospital = async () => {
    try {
      const res = await api.post("/api/hospitals", form);

      // update UI instantly
      setHospitals((prev) => [...prev, res.data]);

      // reset + close
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        license: "",
      });
      setOpen(false);
    } catch (err) {
      console.error("Failed to add hospital", err);
    }
  };

  // filter hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()),
    );
  }, [hospitals, search]);

  // toggle verification
  const toggleVerify = async (id) => {
    try {
      const res = await api.patch(`/api/hospitals/${id}/toggle`);
      setHospitals((prev) => prev.map((h) => (h.id === id ? res.data : h)));
    } catch (err) {
      console.error("Failed to toggle hospital", err);
    }
  };

  if (loading) return <p>Loading hospitals...</p>;

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-9 py-6 space-y-6 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Hospitals</h2>
          <p className="text-gray-400">Manage registered hospitals</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          <Plus size={18} />
          Add Hospital
        </button>
      </div>

      {/* SEARCH */}
      <SearchBarHospital search={search} setSearch={setSearch} />

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1 max-h-[90vh] overflow-y-auto">
        {filteredHospitals.map((h) => (
          <HospitalCard
            key={h.id}
            name={h.name}
            email={h.email}
            phone={h.phone}
            city={h.city}
            license={h.license}
            verified={h.verified}
            onToggle={() => toggleVerify(h.id)}
            onDelete={() => deleteHospital(h.id)}
            id={h.id}
            onEdit={() => openEditModal(h)}
          />
        ))}
      </div>

      {/* MODAL */}
      {editOpen && (
        <div
          onClick={() => setEditOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-lg p-6 space-y-4"
          >
            <h3 className="text-xl font-bold">Edit Hospital</h3>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Hospital Name"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Email"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Phone"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="City"
            />

            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="License ID"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setEditOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateHospital}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {open && (
  <div
    onClick={() => setOpen(false)}
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-md rounded-lg p-6 space-y-4"
    >
      <h3 className="text-xl font-bold">Add Hospital</h3>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Hospital Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Email"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Phone"
      />

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="City"
      />

      <input
        name="license"
        value={form.license}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="License ID"
      />

      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => setOpen(false)}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={addHospital}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Hospital
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Hospital;
