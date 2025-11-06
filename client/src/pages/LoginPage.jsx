import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import http from "../api/http";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await http.post("/auth/login", form);
      login(data.token);
      nav("/verify-key", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      By continuing, you agree to our <span className="underline">Terms of Service</span> and{" "}
      <span className="underline">Privacy Policy</span>.
      <div className="mt-4">Don’t have an account? <Link to="/register" className="text-purple-700 underline">Create one</Link></div>
    </>
  );

  return (
    <AuthLayout
      title="Welcome back to Stackguard"
      subtitle="Secure your codebase with advanced secret scanning security best practices"
      footer={footer}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {err && <div className="text-sm text-red-600">{err}</div>}
        <input name="email" value={form.email} onChange={onChange} placeholder="Enter email ID" className="w-full px-3 py-2 border rounded-lg" />
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Enter password" className="w-full px-3 py-2 border rounded-lg" />
        <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-purple-700 rounded-lg disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
