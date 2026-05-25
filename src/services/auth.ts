import { api } from "./api";

export async function login(username: string, password: string) {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  });

  localStorage.setItem("token", response.data.token);

  return response.data;
}