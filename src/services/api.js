const BASE_URL = "https://kibou-registry-1.onrender.com/api";

// Helper function to ensure trailing slash in URLs
const ensureTrailingSlash = (url) => (url.endsWith("/") ? url : `${url}/`);

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const contentType = response.headers.get("content-type");
    let data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data.message
          ? data.message
          : `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data || {}; // Handle empty responses (e.g., DELETE)
  } catch (e) {
    console.error("Error handling response:", e);
    throw e;
  }
};

// Function to get headers with auth token
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// API Service
const apiService = {
  events: {
    getAll: async (token, params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const url = ensureTrailingSlash(`${BASE_URL}/events`) + (queryParams ? `?${queryParams}` : "");

        const response = await fetch(url, {
          headers: getAuthHeaders(token),
          method: "GET",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("Error in getAll events:", error);
        throw error;
      }
    },

    getById: async (id, token) => {
      try {
        const response = await fetch(ensureTrailingSlash(`${BASE_URL}/events/${id}`), {
          headers: getAuthHeaders(token),
          method: "GET",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("Error in getById event:", error);
        throw error;
      }
    },

    create: async (eventData, token) => {
      try {
        const response = await fetch(ensureTrailingSlash(`${BASE_URL}/events`), {
          headers: getAuthHeaders(token),
          method: "POST",
          body: JSON.stringify(eventData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error("Error in create event:", error);
        throw error;
      }
    },

    update: async (id, eventData, token) => {
      try {
        const response = await fetch(ensureTrailingSlash(`${BASE_URL}/events/${id}`), {
          headers: getAuthHeaders(token),
          method: "PUT",
          body: JSON.stringify(eventData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error("Error in update event:", error);
        throw error;
      }
    },

    delete: async (id, token) => {
      try {
        const response = await fetch(ensureTrailingSlash(`${BASE_URL}/events/${id}`), {
          headers: getAuthHeaders(token),
          method: "DELETE",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("Error in delete event:", error);
        throw error;
      }
    },
  },
};

export default apiService;
