import { AxiosResponse } from 'axios';
import httpClient from './HttpClient';

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

export type abortablePostRequestReturnType<T> = {
    request: Promise<AxiosResponse<T>>;
    abort: () => void;
};

export { abortablePostRequest };
