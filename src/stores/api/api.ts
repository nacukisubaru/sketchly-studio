import { HttpMethod, request, RequestConfig } from '@api/request';

import { create } from 'zustand';

type ApiStatus<T = any> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

type ApiStoreState = {
  requests: Record<string, ApiStatus>;
  runRequest: <T = any>(
    method: HttpMethod,
    url: string,
    config?: RequestConfig
  ) => Promise<T>;
  getRequestData: <T = any>(key: string) => ApiStatus<T>;
};

/**
 * Universal HTTP request via store
 * @param method HTTP method
 * @param url Request URL
 * @param config Axios configuration + optional blockDuplicate flag
 * @param set Zustand set function
 */
async function runRequestFn<T = any>(
  method: HttpMethod,
  url: string,
  config: RequestConfig = {},
  set: (partial: Partial<ApiStoreState> | ((state: ApiStoreState) => Partial<ApiStoreState>)) => void
): Promise<T> {
  const key = `${method}_${url}`;

  set((state) => ({
    requests: {
      ...state.requests,
      [key]: { loading: true, error: null, data: null },
    },
  }));

  const { promise } = request<T>(method, url, config);

  try {
    const data = await promise;

    set((state) => ({
      requests: {
        ...state.requests,
        [key]: { loading: false, error: null, data },
      },
    }));

    return data;
  } catch (err: any) {
    set((state) => ({
      requests: {
        ...state.requests,
        [key]: {
          loading: false,
          error: err?.message || 'Unknown error',
          data: null,
        },
      },
    }));
    throw err;
  }
}

export const useApiStore = create<ApiStoreState>((set, get) => ({
  requests: {},
  runRequest: (method, url, config) => runRequestFn(method, url, config, set),
  getRequestData: (key: string) => {
    return get().requests[key] ?? { loading: false, error: null, data: null };
  },
}));