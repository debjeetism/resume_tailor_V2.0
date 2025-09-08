import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:8010" });

// Attach token if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Register expects FormData with "email" and "password"
export const register = (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  return API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Login expects FormData with "username" (NOT email) and "password"
export const login = (email, password) => {
  const formData = new FormData();
  formData.append("username", email); // OAuth2 expects "username"
  formData.append("password", password);

  return API.post("/auth/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
