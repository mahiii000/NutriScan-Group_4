import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email (e.g. name@example.com).";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length === 0) {
      login(form.name.trim(), form.email.trim());
      navigate("/");
    }
  };

  return (
    <main className="login-page">
      <h1>Welcome back</h1>
      <p className="login-sub">Log in to save your preferences and pinned products.</p>

      <form className="login-card" onSubmit={handleSubmit} noValidate>
        {["name", "email", "password"].map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={handleChange}
              className={errors[field] ? "invalid" : ""}
              aria-invalid={!!errors[field]}
            />
            {errors[field] && <span className="error">{errors[field]}</span>}
          </div>
        ))}
        <button type="submit" className="login-btn">Log in</button>
      </form>
    </main>
  );
}