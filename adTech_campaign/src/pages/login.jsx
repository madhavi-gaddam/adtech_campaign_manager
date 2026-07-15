import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";
import { toast } from "react-toastify";
import { BrandLockup } from "../components/molecules/BrandLockup";
import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { FormField } from "../components/molecules/FormField";

export default function Login() {
  const { currentUser, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (currentUser) return <Navigate to="/" replace />;

  function submit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim()) || values.password.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }
    try {
      const user = login(values);
      const roleDashboard = user.role === "Super Admin" ? "/super-admin" : user.role === "Admin" ? "/admin" : "/";
      toast.success(`Welcome back, ${user.name}.`);
      navigate(location.state?.from?.pathname || roleDashboard, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Unable to log in.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <BrandLockup />
        <h1 className="mt-8 text-2xl font-extrabold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to manage your advertising campaigns.</p>
        <FormField label="Email" htmlFor="email">
          <Input id="email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input id="password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="Enter password" autoComplete="current-password" />
        </FormField>
        {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Login</Button>
        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/signup" className="font-bold text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
