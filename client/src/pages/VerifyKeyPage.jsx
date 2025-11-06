import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import http from "../api/http";
import AuthLayout from "../components/AuthLayout";

export default function VerifyKeyPage() {
  const nav = useNavigate();
  const { refreshUser } = useAuth();
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (key.length < 100) return setErr("Key must be at least 100 characters.");
    setLoading(true);
    try {
      const { data } = await http.post("/user/config", { configKey: key });
      if (data?.token) localStorage.setItem("sg_token", data.token);
      await refreshUser();
      nav("/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your public key"
      subtitle="To get started provide your public key for verification"
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {err && <div className="text-sm text-red-600">{err}</div>}
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your public key"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-purple-700 rounded-lg disabled:opacity-60">
          {loading ? "Verifying..." : "Verify"}
        </button>
        <div className="mt-2 text-sm text-gray-600">
          Don’t have a public key? Contact your administrator
        </div>
      </form>
    </AuthLayout>
  );
}
