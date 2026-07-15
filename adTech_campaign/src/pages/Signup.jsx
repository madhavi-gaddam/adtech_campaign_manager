import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { SelectField } from "../components/atoms/SelectField";
import { BrandLockup } from "../components/molecules/BrandLockup";
import { FormField } from "../components/molecules/FormField";
import { AuthContext } from "../context/AuthContextValue";
import { toast } from "react-toastify";

export default function Signup() {
  const { currentUser, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "", role: "User" });
  const [error, setError] = useState("");

  if (currentUser) return <Navigate to="/" replace />;

  function submit(event) {
    event.preventDefault();

    try {
      const user = signup(values);
      const roleDashboard = user.role === "Super Admin" ? "/super-admin" : user.role === "Admin" ? "/admin" : "/";
      if (user.role === "Super Admin") {
        toast.success(`Welcome, Super Admin ${user.name}.`);
      } else if (user.role === "Admin") {
        toast.success(`Welcome, Admin ${user.name}.`);
      }
      navigate(roleDashboard, { replace: true });
    } catch (signupError) {
      setError(signupError.message || "Unable to create account.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <BrandLockup />
        <h1 className="mt-8 text-2xl font-extrabold text-gray-900">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">Sign up before logging in to the campaign manager.</p>

        <FormField label="Name" htmlFor="name">
          <Input id="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Your name" autoComplete="name" />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <Input id="email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" autoComplete="email" />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <Input id="password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder="Create password" autoComplete="new-password" />
        </FormField>

        <FormField label="Role" htmlFor="role">
          <SelectField id="role" value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value })}>
            <option>User</option>
            <option>Admin</option>
            <option>Super Admin</option>
          </SelectField>
        </FormField>

        {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" className="w-full">Sign Up</Button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
