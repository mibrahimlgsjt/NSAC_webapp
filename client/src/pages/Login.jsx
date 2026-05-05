import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "admin", password: "NSAC2026" });
  const [error, setError] = useState("");

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form.username, form.password);
      navigate(location.state?.from || "/admin");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  }

  return (
    <div className="container narrow">
      <PageHeader title="Volunteer Login" kicker="Admin access" />
      <ErrorState message={error} />
      <form className="form-panel" onSubmit={submit}>
        <input className="form-control" name="username" value={form.username} onChange={update} placeholder="Username" required />
        <input className="form-control" name="password" type="password" value={form.password} onChange={update} placeholder="Password" required />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
}

export default Login;
