import { useState } from "react";

export default function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("admin123");
  const [error, setError] = useState("");

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1>True Furnitures</h1>
        <p>Admin Panel · Indore</p>
        <input value={user} onChange={(event) => setUser(event.target.value)} placeholder="Username" />
        <input
          value={pass}
          type="password"
          onChange={(event) => setPass(event.target.value)}
          placeholder="Password"
        />
        <button
          type="button"
          className="primary-btn full-btn"
          onClick={() => {
            if (user === "admin" && pass === "admin123") onLogin();
            else setError("Invalid credentials. Use admin / admin123.");
          }}
        >
          Sign In
        </button>
        {error ? <div className="error-note">{error}</div> : null}
      </div>
    </div>
  );
}
