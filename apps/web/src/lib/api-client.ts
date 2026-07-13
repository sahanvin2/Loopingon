import { cache } from "react";
import { buildQueryString } from "./utils";
import { useAuthStore } from "@/stores/auth-store";

export class ApiError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown> | null;

  constructor(
    message: string,
    status: number = 500,
    code: string = "INTERNAL_ERROR",
    details: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, unknown>;
  body?: unknown;
  timeout?: number;
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  // 1. Try to get it directly from the in-memory Zustand store first (immediate)
  try {
    const memToken = useAuthStore.getState().accessToken;
    if (memToken) return memToken;
  } catch (e) {
    // ignore
  }

  // 2. Fallback to localStorage (async sync)
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.accessToken) {
        return parsed.state.accessToken;
      }
    }
  } catch {
    // fallback below
  }

  try {
    const legacy = localStorage.getItem("accessToken");
    if (legacy) return legacy;
  } catch {
    // ignore
  }

  return null;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    params,
    body,
    timeout = 30000,
    ...fetchOptions
  } = options;

  let baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://kandyam.com/api/v1";
  
  // Fix for Node 18+ SSR IPv6 localhost resolution issue
  if (typeof window === "undefined" && baseUrl.includes("localhost")) {
    baseUrl = baseUrl.replace("localhost", "127.0.0.1");
  }

  const url = `${baseUrl}${endpoint}${params ? buildQueryString(params) : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = await getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: "include",
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        const errorMessage = typeof data.message === 'string' ? data.message : (typeof data.error === 'string' ? data.error : data.error?.message) || `Request failed with status ${response.status}`;
        throw new ApiError(
          errorMessage,
          response.status,
          data.code || data.error?.code || data.errorCode || "REQUEST_ERROR",
          data.details || data.error?.details || data.errors || null,
        );
      }

      return data as T;
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        "REQUEST_ERROR",
      );
    }

    const text = await response.text();
    return text as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408, "TIMEOUT");
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        "Network error. Please check your internet connection.",
        0,
        "NETWORK_ERROR",
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      500,
      "UNKNOWN_ERROR",
    );
  }
}

export async function get<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return request<T>(endpoint, { method: "GET", params });
}

export const getCached = cache(get);

export async function post<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> {
  return request<T>(endpoint, { method: "POST", body: data, params });
}

export async function patch<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> {
  return request<T>(endpoint, { method: "PATCH", body: data, params });
}

export async function del<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return request<T>(endpoint, { method: "DELETE", params });
}

export async function uploadFile<T>(
  endpoint: string,
  file: File | Blob,
  fieldName: string = "file",
  extraFields?: Record<string, string>,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://kandyam.com/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const formData = new FormData();
  formData.append(fieldName, file);

  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.message || "Upload failed",
      response.status,
      data.code || "UPLOAD_ERROR",
      data.details,
    );
  }

  return response.json() as Promise<T>;
}

export async function uploadMultipleFiles<T>(
  endpoint: string,
  files: (File | Blob)[],
  fieldName: string = "files",
  extraFields?: Record<string, string>,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://kandyam.com/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const formData = new FormData();

  files.forEach((file) => {
    formData.append(fieldName, file);
  });

  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.message || "Upload failed",
      response.status,
      data.code || "UPLOAD_ERROR",
      data.details,
    );
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get,
  post,
  patch,
  delete: del,
  upload: uploadFile,
  uploadMultiple: uploadMultipleFiles,
};
