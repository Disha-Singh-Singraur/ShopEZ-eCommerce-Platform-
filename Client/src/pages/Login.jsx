import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // Save to AuthContext
      login(data.user);
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-sm-5" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Welcome <span className="text-primary">Back</span>
          </h2>
          <p className="text-muted">Enter your details to access your account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 border-0 rounded-3 text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control rounded-3 bg-light border-0"
              id="floatingEmail"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingEmail" className="text-muted">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control rounded-3 bg-light border-0"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword" className="text-muted">Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted mb-0">
            Don't have an account? <Link to="/register" className="text-primary fw-medium text-decoration-none">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
