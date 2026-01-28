import { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      const res = await api.post("/api/auth/login", form);

      const userData = {
        name: res.data.name,
        role: res.data.role,
        email: form.email,
        token: res.data.token,
      };

      login(userData);

      // Check if user was redirected from signup as donor
      if (sessionStorage.getItem("pendingDonorRegistration") === "true" && userData.role === "donor") {
        // Check if donor profile is already registered
        const donorRegistered = localStorage.getItem("donorRegistered");
        sessionStorage.removeItem("pendingDonorRegistration"); // Clear the flag
        if (!donorRegistered) {
          navigate("/dashboard/register-donor");
          return;
        }
      }

      // For existing donor users, check if they need to register donor profile
      if (userData.role === "donor") {
        const donorRegistered = localStorage.getItem("donorRegistered");
        if (!donorRegistered) {
          // Show prompt to register as donor
          if (window.confirm("Would you like to register as a blood donor? This will help match you with blood requests.")) {
            navigate("/dashboard/register-donor");
            return;
          }
        }
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-bold">Login</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="bg-red-600 text-white py-2 w-full rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
