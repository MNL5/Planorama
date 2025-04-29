import { AxiosResponse } from "axios";

import httpClient from "./http-client";

const abortablePostRequest = <T>(url: string, body: object) => {
  const abortController = new AbortController();

  const request = httpClient.post<T>(url, body, {
    signal: abortController.signal,
  });

  return {
    request,
    abort: () => abortController.abort(),
  };
};

const abortablePutRequest = <T>(url: string, body: object) => {
  const abortController = new AbortController();

  const request = httpClient.put<T>(url, body, {
    signal: abortController.signal,
  });

  return {
    request,
    abort: () => abortController.abort(),
  };
};

const abortableGetRequest = <T>(url: string) => {
  const abortController = new AbortController();

  const request = httpClient.get<T>(url, {
    signal: abortController.signal,
  });

  return {
    request,
    abort: () => abortController.abort(),
  };
};

const abortableDeleteRequest = <T>(url: string) => {
  const abortController = new AbortController();

  const request = httpClient.delete<T>(url, {
    signal: abortController.signal,
  });

  return {
    request,
    abort: () => abortController.abort(),
  };
};

type AbortableRequestReturnType<T> = {
  request: Promise<AxiosResponse<T>>;
  abort: () => void;
};

export type { AbortableRequestReturnType };
export {
  abortablePostRequest,
  abortableGetRequest,
  abortablePutRequest,
  abortableDeleteRequest,
};
