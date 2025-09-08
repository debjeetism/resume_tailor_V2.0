 import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:8010" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const processResume = (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);
  return API.post("/resume/process", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const exportPDF = (id) =>
  API.post(`/resume/export/${id}`, {}, { responseType: "blob" });


export const fetchHistory = () => API.get("/resume/history");

