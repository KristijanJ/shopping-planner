import { ReactNode } from "react";
import { useAuth } from "../context/authContext/authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
}
