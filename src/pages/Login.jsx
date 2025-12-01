import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">



      {/* ================= LEFT : LOGIN FORM ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to continue to Amma Delightz
          </p>

          {error && (
            <p className="text-red-600 mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              required
              className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              required
              className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-green-700 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ================= RIGHT : IMAGE ================= */}
<div className="relative h-full overflow-hidden hidden md:block">

  <img
    src="/login_img.jpg"
    alt="Food background"
    className="w-full h-full object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Center Text */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h2 className="text-white text-4xl font-bold text-center px-6 hidden md:block">
      Discover Delicious Recipes Every Day
    </h2>
  </div>
</div>


    </div>
  );
}
