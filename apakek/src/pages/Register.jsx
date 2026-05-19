import React, { useState } from "react";

const BASE_URL = "http://localhost:5000/api";

export default function Register({ onNavigateLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi.");
      }

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman masuk...");
      setTimeout(() => {
        onNavigateLogin();
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat mendaftar.");
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
          <p>Mulai atur prioritas hidup Anda secara terstruktur</p>
        </div>

        <div className="auth-card">
          <h2>Daftar Akun</h2>
          
          {errorMsg && (
            <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", fontWeight: 500 }}>
              ⚠ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ color: "#10b981", fontSize: "14px", marginBottom: "16px", fontWeight: 500 }}>
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nama Pengguna *</label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Masukkan nama Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

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
                placeholder="Buat kata sandi minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <div className="auth-footer">
            Sudah punya akun?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }}>
              Masuk di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
