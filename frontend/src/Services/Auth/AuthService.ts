import { CredentialResponse } from "@react-oauth/google";
import apiClient, { Page } from "./apiClient";

const signUp = (user: User) => {
  const abortController = new AbortController();
  const request = apiClient.post<LoginResponse>(`/auth/register`, user, {
    signal: abortController.signal,
  });
  return { request, abort: () => abortController.abort() };
};

const googleRegister = (credential: CredentialResponse) => {
  const abortController = new AbortController();
  const request = apiClient.post<LoginResponse>(`/auth/google`, credential, {
    signal: abortController.signal,
  });
  return { request, abort: () => abortController.abort() };
};

const login = (identifier: string, password: string) => {
  const abortController = new AbortController();
  const request = apiClient.post<LoginResponse>(
    `/auth/login`,
    { username: identifier, email: identifier, password },
    {
      signal: abortController.signal,
    }
  );
  return { request, abort: () => abortController.abort() };
};

const refresh = (refreshToken: string) => {
  const abortController = new AbortController();
  const request = apiClient.post<LoginResponse>(
    `/auth/refresh`,
    { refreshToken },
    {
      signal: abortController.signal,
    }
  );
  return { request, abort: () => abortController.abort() };
};

const logout = (refreshToken: string) => {
  const abortController = new AbortController();
  const request = apiClient.post<LoginResponse>(
    `/auth/logout`,
    { refreshToken },
    {
      signal: abortController.signal,
    }
  );
  return { request, abort: () => abortController.abort() };
};


export default { register, login, refresh, logout, googleRegister };