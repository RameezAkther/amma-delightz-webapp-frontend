import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("please log in");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
