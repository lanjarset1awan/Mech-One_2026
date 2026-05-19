import React, { useState } from "react";

const BASE_URL = "http://localhost:5000/api";

export default function Login({ onLoginSuccess, onNavigateRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email atau password salah.");
      }

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-icon"></div>
          <h1>DoneRight</h1>
          <p>Kelola semua tugas Anda dengan mudah dan terorganisir</p>
        </div>

        <div className="auth-card">
          <h2>Masuk</h2>
          
          {errorMsg && (
            <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", fontWeight: 500 }}>
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Alamat Email *</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Kata Sandi *</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="auth-footer">
            Belum punya akun?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateRegister(); }}>
              Daftar di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
