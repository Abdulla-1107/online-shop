import axios from "axios";
import { loadState } from "./storage";

const request = axios.create({ baseURL: "https://keldibekov.online" });

request.interceptors.request.use((config) => {
  const token = loadState("token");
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export { request };
