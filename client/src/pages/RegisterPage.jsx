import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // basic validations
    if (!form.firstName || !form.lastName)
      return setErr("Enter your full name.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      return setErr("Enter a valid email ID.");
    if (form.password.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (form.password !== form.confirm)
      return setErr("Passwords do not match.");

    setLoading(true);
    try {
      // hit registration endpoint
      const { data } = await http.post("/auth/register", {
        email: form.email,
        password: form.password,
      });

      // if private key exists in response, trigger download
      if (data?.privateKey) {
        const blob = new Blob([data.privateKey], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stackguard-private-key.pem";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(
          "✅ Account created successfully!\nYour private key has been downloaded as 'stackguard-private-key.pem'.\nKeep it safe — you’ll need it for secure access."
        );
      } else {
        alert("Account created successfully!");
      }

      nav("/login", { replace: true });
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      By continuing, you agree to our{" "}
      <span className="underline cursor-pointer">Terms of Service</span> and{" "}
      <span className="underline cursor-pointer">Privacy Policy</span>.
      <div className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-700 underline">
          Sign in
        </Link>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Welcome to Stackguard"
      subtitle="Secure your codebase with advanced secret scanning security best practices"
      footer={footer}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Enter first name"
            className="px-3 py-2 border rounded-lg"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Enter last name"
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Enter email ID"
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Enter password"
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={onChange}
          placeholder="Confirm password"
          className="w-full px-3 py-2 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
