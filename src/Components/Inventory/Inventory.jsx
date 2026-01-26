import React, { useEffect, useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";
import Unit from "./Unit";
import InventoryItem from "./InventoryItem";
import api from "../../services/api.js"; // adjust path if needed

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    hospitalId: "",
    bloodGroup: "",
    units: "",
    expiry: "",
  });

  /* ---------------- FETCH DATA ---------------- */

  const fetchInventory = async () => {
    const res = await api.get("/api/inventory");
    setInventory(res.data);
  };

  const fetchHospitals = async () => {
    const res = await api.get("/api/hospitals");
    setHospitals(res.data);
  };

  useEffect(() => {
    fetchInventory();
    fetchHospitals();
  }, []);

  /* ---------------- MODAL SCROLL LOCK ---------------- */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  /* ---------------- MODAL HANDLERS ---------------- */

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      hospitalId: "",
      bloodGroup: "",
      units: "",
      expiry: "",
    });
    setOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      hospitalId: item.hospitalId,
      bloodGroup: item.bloodGroup,
      units: item.units,
      expiry: item.expiry,
    });
    setOpen(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- SAVE INVENTORY ---------------- */

  const saveInventory = async () => {
    try {
      const hospital = hospitals.find((h) => h.id === Number(form.hospitalId));

      const payload = {
        hospitalId: Number(form.hospitalId),
        hospitalName: hospital?.name || "",
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        expiry: form.expiry,
      };

      if (editingItem) {
        const res = await api.patch(
          `/api/inventory/${editingItem.id}`,
          payload,
        );

        setInventory((prev) =>
          prev.map((i) => (i.id === editingItem.id ? res.data : i)),
        );
      } else {
        const res = await api.post("/api/inventory", payload);
        setInventory((prev) => [...prev, res.data]);
      }

      setOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to save inventory", err);
    }
  };

  /* ---------------- STATS ---------------- */

  const totalUnits = useMemo(
    () => inventory.reduce((sum, i) => sum + Number(i.units), 0),
    [inventory],
  );

  const hospitalCount = useMemo(
    () => new Set(inventory.map((i) => i.hospitalId)).size,
    [inventory],
  );

  const unitsByGroup = useMemo(() => {
    const map = {};
    inventory.forEach((i) => {
      map[i.bloodGroup] = (map[i.bloodGroup] || 0) + i.units;
    });
    return map;
  }, [inventory]);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-9 py-6 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Blood Inventory</h2>
          <p className="text-gray-400">
            Track blood units across all hospitals
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="active:scale-95 text-white font-semibold flex items-center gap-3 bg-red-500 hover:bg-red-600 rounded-lg py-2 px-4"
        >
          <Plus size={18} />
          Add Inventory
        </button>
      </div>

      {/* BLOOD GROUP SUMMARY */}
      <div className="grid grid-cols-8 gap-8">
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
          <Unit key={bg} bg={bg} units={unitsByGroup[bg] || 0} />
        ))}
      </div>

      {/* TOTAL */}
      <div className="bg-red-500 rounded-lg flex items-center justify-between py-8 px-5">
        <div className="flex text-white gap-5">
          <div className="bg-white/20 rounded-lg py-4 px-6">
            <Package size={40} />
          </div>
          <div>
            <h2 className="text-xl text-white/90">
              Total Blood Units Available
            </h2>
            <h1 className="text-5xl font-bold">{totalUnits}</h1>
          </div>
        </div>
        <div className="text-white text-right">
          <h2 className="text-xl text-white/90">Across</h2>
          <h1 className="text-4xl font-bold">{hospitalCount} Hospitals</h1>
        </div>
      </div>

      {/* TABLE */}
      <div>
        <h3 className="font-bold text-2xl">Detailed Inventory</h3>

        <div className="border-t mt-4 grid grid-cols-7 px-2 py-2 text-gray-500 bg-white">
          <h3>Hospital</h3>
          <h3>Blood Group</h3>
          <h3>Units</h3>
          <h3>Status</h3>
          <h3>Expiry</h3>
          <h3>Updated</h3>
          <h3>Actions</h3>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {inventory.map((item) => (
            <InventoryItem
              key={item.id}
              data={item}
              onEdit={() => openEditModal(item)}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-lg p-6 space-y-4"
          >
            <h3 className="text-xl font-bold">
              {editingItem ? "Edit Inventory" : "Add Inventory"}
            </h3>

            {/* Hospital Select */}
            <select
              name="hospitalId"
              value={form.hospitalId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            <input
              name="units"
              value={form.units}
              onChange={handleChange}
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Units Available"
            />

            <input
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              type="date"
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveInventory}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
