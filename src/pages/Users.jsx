import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  // ✅ FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchQuery) params.set("q", searchQuery);

        const res = await axiosInstance.get(`/admin/users?${params}`);

        setUsers(res.data.users);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery]);

  // ✅ SEARCH BUTTON
  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput);
  };

  // ✅ DELETE USER
  const deleteUser = async (id) => {
    const confirm = window.confirm("Delete this user permanently?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <p className="text-center mt-24 text-gray-600">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto pt-28 pb-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin – Users</h1>

      {/* ✅ SEARCH */}
      <div className="flex gap-3 mb-6 justify-center">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by username or email..."
          className="px-4 py-2 border rounded-full w-80"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      {/* ✅ USERS TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.role === "ADMIN"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.profile?.location || "—"}
                </td>
                <td className="px-4 py-3">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ PAGINATION */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-full disabled:opacity-50"
        >
          ← Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-full border ${
              page === i + 1
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-full disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
