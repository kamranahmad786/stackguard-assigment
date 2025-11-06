import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ConfigGate component
 * --------------------
 * This acts as a route guard for configured users.
 * If the user has completed key verification (isConfigured=true),
 * they can access the page (e.g., Dashboard).
 * Otherwise, they are redirected to /verify-key.
 */
export default function ConfigGate() {
  const { user } = useAuth();

  // if user is configured, allow route access
  if (user?.isConfigured) return <Outlet />;

  // otherwise redirect to verification
  return <Navigate to="/verify-key" replace />;
}
