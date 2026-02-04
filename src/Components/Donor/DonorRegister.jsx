import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const DonorRegister = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    city: "",
  });





  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
  console.log("Submitting donor form:", form);
  console.log("Token:", localStorage.getItem("token"));

  try {
    await api.post("/donors/register", form);
    setSubmitted(true);
    localStorage.setItem("donorRegistered", "true");
    setTimeout(() => navigate("/dashboard"), 2500);

  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.error || "Registration failed");
  }
};


  if (submitted) {
    return (
      <div className="h-full flex items-center justify-center px-4 py-6">
        <div className="bg-white p-6 md:p-8 rounded shadow text-center space-y-2 w-full sm:w-96">
          <h2 className="text-lg md:text-xl font-bold text-green-600">
            Registration Submitted
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Your donor profile is under verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center px-4 py-6">
      <div className="bg-white p-6 md:p-8 rounded shadow w-full sm:w-96 space-y-4">
        <h2 className="text-lg md:text-xl font-bold">Register as Donor</h2>

        <input
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full text-sm md:text-base"
          onChange={handleChange}
        />

        <select
          name="gender"
          className="border p-2 w-full text-sm md:text-base"
          onChange={handleChange}
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <select
          name="bloodGroup"
          className="border p-2 w-full text-sm md:text-base"
          onChange={handleChange}
        >
          {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(bg => (
            <option key={bg}>{bg}</option>
          ))}
        </select>

        <input
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full text-sm md:text-base"
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          className="border p-2 w-full text-sm md:text-base"
          onChange={handleChange}
        />

        <button
          onClick={submit}
          disabled={submitted}
          className="bg-red-600 text-white py-2 w-full rounded text-sm md:text-base"
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
};

export default DonorRegister;
