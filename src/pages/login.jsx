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
        bloodGroup: res.data.bloodGroup,
        phone: res.data.phone,
      };

      login(userData);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 py-6">
      <div className="bg-white p-6 sm:p-8 rounded shadow w-full sm:w-80 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">Login</h2>

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
          className="bg-red-600 text-white py-2 w-full rounded text-sm sm:text-base"
        >
          Login
        </button>

        <div className="text-center text-xs sm:text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-red-600 font-semibold hover:underline"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
