import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const [diet, setDiet] = useState("");
  const [favoriteCuisines, setFavoriteCuisines] = useState("");

  // per-section edit state
  const [editing, setEditing] = useState({
    profile: false,
    preferences: false,
    password: false,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userId = localStorage.getItem("userId"); // ✅ STORE THIS AT LOGIN

  // ✅ Fetch user
  useEffect(() => {
    axiosInstance.get(`/users/${userId}`).then((res) => {
      setUser(res.data);
      setBio(res.data.profile?.bio || "");
      setLocation(res.data.profile?.location || "");
      setDiet(res.data.preferences?.diet?.[0] || "");
      setFavoriteCuisines(
        res.data.preferences?.favoriteCuisines?.join(", ") || ""
      );
    });
  }, [userId]);

  if (!user) return <p className="mt-24 text-center">Loading profile...</p>;

  // ✅ Update Bio
  const updateBio = async () => {
    try {
      const res = await axiosInstance.put(`/users/${userId}/bio`, { bio });
      setUser(res.data);
      setEditing((s) => ({ ...s, profile: false }));
      toast.success("Bio updated!");
      return res;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bio");
    }
  };

  // ✅ Update Location
  const updateLocation = async () => {
    try {
      const res = await axiosInstance.put(`/users/${userId}/location`, { location });
      setUser(res.data);
      setEditing((s) => ({ ...s, profile: false }));
      toast.success("Location updated!");
      return res;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update location");
    }
  };

  // ✅ Update Preferences
  const updatePreferences = async () => {
    try {
      const payload = {
        diet: diet ? [diet] : [],
        favoriteCuisines: favoriteCuisines
          ? favoriteCuisines.split(",").map((c) => c.trim())
          : [],
      };
      const res = await axiosInstance.put(`/users/${userId}/preferences`, payload);
      setUser(res.data);
      setEditing((s) => ({ ...s, preferences: false }));
      toast.success("Preferences updated!");
      return res;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update preferences");
    }
  };

  // ✅ Change Password
  const changePassword = async () => {
    try {
      const res = await axiosInstance.put(`/users/${userId}/password`, {
        oldPassword,
        newPassword,
      });
      setUser(res.data);
      toast.success("Password changed!");
      setOldPassword("");
      setNewPassword("");
      setEditing((s) => ({ ...s, password: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-28 px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Avatar + basic info */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center text-center">
          <img src={user.profile?.avatar || "/default-avatar.png"} alt="avatar" className="w-28 h-28 rounded-full object-cover mb-3" />
          <h2 className="text-xl font-semibold">{user.profile?.name || user.username}</h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-500 mt-2">{user.email}</p>
          <p className="mt-3 inline-block text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">{user.role}</p>
        </div>

        {/* MIDDLE: Profile details */}
        <div className="md:col-span-2 space-y-6">
          {/* BIO (read-only until edit) */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">About</h3>
              <div className="flex items-center gap-2">
                {!editing.profile ? (
                  <button onClick={() => setEditing((s) => ({ ...s, profile: true }))} aria-label="Edit profile" className="text-emerald-600 hover:text-emerald-700">
                    ✎
                  </button>
                ) : (
                  <button onClick={() => setEditing((s) => ({ ...s, profile: false }))} aria-label="Cancel edit" className="text-gray-500 hover:text-gray-700">✕</button>
                )}
              </div>
            </div>

            {!editing.profile ? (
              <div className="mt-3 text-gray-700">
                <p className="mb-2">{user.profile?.bio || "No bio yet."}</p>
                <p className="text-sm text-gray-500">{user.profile?.location || "Location not set"}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={3} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={async () => { await updateBio(); await updateLocation(); }} className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => { setBio(user.profile?.bio || ""); setLocation(user.profile?.location || ""); setEditing((s) => ({ ...s, profile: false })); }} className="px-4 py-2 rounded border">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* PREFERENCES */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preferences</h3>
              {!editing.preferences ? (
                <button onClick={() => setEditing((s) => ({ ...s, preferences: true }))} aria-label="Edit preferences" className="text-emerald-600">✎</button>
              ) : (
                <button onClick={() => setEditing((s) => ({ ...s, preferences: false }))} aria-label="Cancel preferences" className="text-gray-500">✕</button>
              )}
            </div>

            {!editing.preferences ? (
              <div className="mt-3">
                <div className="flex gap-2 flex-wrap">
                  {(user.preferences?.diet || []).map((d, i) => (
                    <span key={i} className="text-sm px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{d}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {(user.preferences?.favoriteCuisines || []).map((c, i) => (
                    <span key={i} className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">{c}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Diet</label>
                  <input value={diet} onChange={(e) => setDiet(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="vegetarian" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Favorite Cuisines</label>
                  <input value={favoriteCuisines} onChange={(e) => setFavoriteCuisines(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="South Indian, North Indian" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={updatePreferences} className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => { setDiet(user.preferences?.diet?.[0] || ""); setFavoriteCuisines((user.preferences?.favoriteCuisines || []).join(", ") || ""); setEditing((s) => ({ ...s, preferences: false })); }} className="px-4 py-2 rounded border">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* CHANGE PASSWORD */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Security</h3>
              {!editing.password ? (
                <button onClick={() => setEditing((s) => ({ ...s, password: true }))} className="text-emerald-600">✎</button>
              ) : (
                <button onClick={() => setEditing((s) => ({ ...s, password: false }))} className="text-gray-500">✕</button>
              )}
            </div>

            {!editing.password ? (
              <p className="mt-3 text-sm text-gray-500">
                Last updated: {user.updatedAt && !isNaN(new Date(user.updatedAt).getTime()) 
                  ? new Date(user.updatedAt).toLocaleDateString() 
                  : "Not available"}
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <input type="password" placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                <div className="flex gap-3 mt-2">
                  <button onClick={changePassword} className="bg-red-600 text-white px-4 py-2 rounded">Change Password</button>
                  <button onClick={() => { setOldPassword(""); setNewPassword(""); setEditing((s) => ({ ...s, password: false })); }} className="px-4 py-2 rounded border">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
