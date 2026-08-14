import axios from "axios";

export const coreApi = axios.create({
  baseURL: "/core/",
  timeout: 5000,
});

export const agentApi = axios.create({
  baseURL: "/agent/",
  timeout: 5000,
});

export type HealthResponse = {
  status: string;
  service: string;
  backend: string;
  api?: string;
};
