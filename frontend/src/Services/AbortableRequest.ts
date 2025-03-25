const abortablePostRequest<T> = (url: string, body: object) => {
  const abortController = new AbortController();

  return {
    apiClient.post<T>(url, body, {
               signal: abortController.signal,
    }),
    abort: () => abortController.abort()
  };
}