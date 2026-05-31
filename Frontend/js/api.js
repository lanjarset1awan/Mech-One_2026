const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
const BASE_URL = isLocal ? "http://localhost:5005" : "https://mech-one-2026.vercel.app";

async function register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

async function login(data) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

async function uploadProfile(formData, token) {
    const res = await fetch(`${BASE_URL}/profile/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    return res.json();
}

async function registerCompetition(formData, token) {
    const res = await fetch(`${BASE_URL}/competition/register`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    return res.json();
}

async function getRegistrationStatus(token) {
    const res = await fetch(`${BASE_URL}/competition/status`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}

async function getProfile(token) {
    const res = await fetch(`${BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}

async function updateProfile(data, token) {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

async function uploadProposal(formData, token) {
    const res = await fetch(`${BASE_URL}/competition/upload-proposal`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    return res.json();
}