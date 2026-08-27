const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const REQUEST_TIMEOUT = 60000; // 60 seconds

export async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
    ...(options.headers || {}),
  };

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      // Empty response body
    }

    if (!response.ok) {
      throw new Error(
        data?.detail ||
          data?.message ||
          `Request failed with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The server is taking too long to respond. It may be waking up from sleep. Please try again.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
