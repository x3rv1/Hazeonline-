const API_BASE = "/api";

/**
 * Make a GET request to the API
 */
export async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API GET error:", error);
    return [];
  }
}

/**
 * Make a POST request with form data
 */
export async function apiPost(endpoint, data) {
  try {
    const formData = new FormData();
    for (const key in data) {
      // Skip null, undefined, and empty strings
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Request failed");
    }
    return await response.json();
  } catch (error) {
    console.error("API POST error:", error);
    throw error;
  }
}

/**
 * Make a PATCH request with form data
 */
export async function apiPatch(endpoint, data) {
  try {
    const formData = new FormData();
    for (const key in data) {
      // Skip null, undefined, and empty strings
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API PATCH error:", error);
    throw error;
  }
}

/**
 * Make a DELETE request
 */
export async function apiDelete(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API DELETE error:", error);
    throw error;
  }
}
