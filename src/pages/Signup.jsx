import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    name: "",
    avatar: "",
    bio: "",
    location: "",
  });

  const [step, setStep] = useState(1); // 1: credentials, 2: profile setup

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitSignup = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/signup", payload);

      // Auto-login: clear previous user data, then login with new credentials
      try {
        // remove previous auth data
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } catch (e) {
        // ignore
      }

      const res = await axiosInstance.post("/auth/login", {
        email: payload.email,
        password: payload.passwordHash,
      });

      // clear again to be safe, then set new values
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      } catch (e) {}

      localStorage.setItem("token", res.data.token);
      // attempt to store user id if backend returned it
      const userId = res.data.user?.id || res.data.userId || res.data.id || res.data.user?._id;
      if (userId) localStorage.setItem("userId", userId);

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsNext = (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!formData.username || !formData.email || !formData.passwordHash) {
      setError("Please provide username, email and password.");
      return;
    }

    // confirm password match
    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // password strength: min 8 chars, number, upper, lower, special
    const pass = formData.passwordHash;
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pass);
    if (!strong) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number and special character.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSkipProfile = async () => {
    // send minimal signup payload
    const payload = {
      username: formData.username,
      email: formData.email,
      passwordHash: formData.passwordHash,
      profile: {},
    };
    await submitSignup(payload);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      email: formData.email,
      passwordHash: formData.passwordHash,
      profile: {
        name: formData.name || undefined,
        avatar: formData.avatar || undefined,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
      },
    };
    await submitSignup(payload);
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">


      {/* LEFT : IMAGE */}
      <div className="relative h-full overflow-hidden hidden md:block">

        <img
          src="/signup_img.jpg"
          alt="Food background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h2 className="text-white text-4xl font-bold text-center">
            Join Our Food Lover Community
          </h2>
        </div>
      </div>

      {/* RIGHT : SIGNUP FORM (multi-step) */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg overflow-y-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Start sharing and discovering recipes</p>

          {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

          {step === 1 && (
            <form onSubmit={handleCredentialsNext} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input name="username" value={formData.username} placeholder="Username" onChange={handleChange} required className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input name="email" value={formData.email} placeholder="Email" type="email" onChange={handleChange} required className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input name="passwordHash" value={formData.passwordHash} placeholder="Password" type="password" onChange={handleChange} required className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Re-enter Password</label>
                <input name="confirmPassword" value={formData.confirmPassword} placeholder="Re-enter Password" type="password" onChange={handleChange} required className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <Link to="/login" className="text-sm text-gray-600 hover:underline">Already have an account?</Link>
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-md">Next</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <p className="text-sm text-gray-600">Tell us a little about yourself — this step is optional and can be skipped.</p>

              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input name="name" value={formData.name} placeholder="Full Name" onChange={handleChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Avatar URL</label>
                <input name="avatar" value={formData.avatar} placeholder="https://example.com/avatar.jpg" onChange={handleChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Short Bio</label>
                <input name="bio" value={formData.bio} placeholder="Food enthusiast & home cook" onChange={handleChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input name="location" value={formData.location} placeholder="City, Country" onChange={handleChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 mt-1" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-md border">Back</button>
                <div className="flex gap-2">
                  <button type="button" onClick={handleSkipProfile} className="px-4 py-2 rounded-md border">Skip</button>
                  <button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-md">{loading ? 'Signing Up...' : 'Finish'}</button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
