export const API_URL = "http://localhost:8080/api";

export async function apiRequest(endpoint, method = "GET", body = null, auth = false, isAdmin = false, isMultipart = false) {
  const headers = {};

  if (auth) {
    const token = isAdmin ? localStorage.getItem("adminToken") : localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
  }

  const isFormData = body instanceof FormData;

  if (!isFormData && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method: method,
    headers: headers,
    body: null
  };

  if (body) {
    if (isFormData) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(API_URL + endpoint, options);

  const contentType = res.headers.get("Content-Type") || "";

  if (!res.ok) {
    let msg = "Error en la petición";
    try {
      if (contentType.includes("application/json")) {
        const err = await res.json();
        if (err && err.message) {
          msg = err.message;
        }
      } else {
        const textError = await res.text();
        if (textError) {
          msg = textError || `Error ${res.status}: ${res.statusText}`;
        }
      }
    } catch (e) {
      msg = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(msg);
  }

  if (
    contentType.includes("application/pdf") ||
    contentType.includes("image")
  ) {
    return await res.blob();
  }

  if (contentType.includes("application/json")) {
    return await res.json();
  }

  if (contentType.includes("text/plain")) {
    return await res.text();
  }

  return null;
}