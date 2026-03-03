import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RequestConfig extends AxiosRequestConfig {
  blockDuplicate?: boolean;
}

export interface RequestResult<T = any> {
  promise: Promise<T>;
  cancel: () => void;
}

const REQUEST_TIMEOUT = 10000;

const api = axios.create({
  baseURL: window.SKETCHLY_API_URL,
  timeout: REQUEST_TIMEOUT,
});

const pendingRequests = new Map<string, { cancel:() => void; promise: Promise<any> }>();

const createCancelableRequest = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

/**
 * Universal HTTP request
 * @param method HTTP method
 * @param url Request URL
 * @param config Axios configuration + optional blockDuplicate flag
 */
export function request<T = any>(
  method: HttpMethod,
  url: string,
  config: RequestConfig = {},
): RequestResult<T> {
  const { blockDuplicate = false, ...axiosOptions } = config;

  const paramsKey = axiosOptions.params ? JSON.stringify(axiosOptions.params) : '';
  const requestKey = blockDuplicate ? `${method}:${url}?${paramsKey}` : null;

  if (requestKey && pendingRequests.has(requestKey)) {
    pendingRequests.get(requestKey)!.cancel();
  }

  const { signal, cancel } = createCancelableRequest();

  const promise = api({
    method, url, signal, ...axiosOptions,
  }).then(
    (res: AxiosResponse<T>) => res.data,
  );

  if (requestKey) {
    pendingRequests.set(requestKey, { cancel, promise });

    promise.finally(() => pendingRequests.delete(requestKey));
  }

  return { promise, cancel };
}
