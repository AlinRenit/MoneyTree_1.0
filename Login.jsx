import React, { useState } from "react";
// Mock user data
const MOCK_USER = {
  username: "demo",
  password: "password123",
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username === MOCK_USER.username &&
      password === MOCK_USER.password
    ) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  if (loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h2>Welcome, {username}!</h2>
        <button onClick={handleLogout} style={{ padding: "8px 24px" }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Login to Money Tree</h2>
      <form onSubmit={handleLogin} style={{ display: "inline-block", marginTop: 20 }}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: 8, marginBottom: 12, width: 180 }}
            autoFocus
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, marginBottom: 12, width: 180 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 24px" }}>Login</button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 24, color: "#555" }}>
        <strong>Demo credentials:</strong><br />
        Username: <code>demo</code><br />
        Password: <code>password123</code>
      </div>
    </div>
  );
}

export default Login;