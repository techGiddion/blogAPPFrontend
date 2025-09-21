import axios from 'axios'


const api=  axios.create({
    baseURL: "https://blogappbackend-1gaz.onrender.com",
    headers: { "Content-Type": "application/json" },
    withCredentials: true // 👈 this allows cookies from server

})

// Add an interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Ask backend for new access token (refresh cookie is auto-sent)
        const res = await axios.get("http://localhost:4000/refresh", {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        window.location.href = "/login"; // force logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;