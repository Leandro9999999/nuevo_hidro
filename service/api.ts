import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // el token que guardas al login/registro
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para el manejo global de errores.
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, no hace nada.
  (error) => {
    // Si hay un error, lo procesamos aquí.
    console.error("Error en la petición:", error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx.
      return Promise.reject(
        error.response.data || {
          message: "Error en la respuesta del servidor.",
        }
      );
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta.
      return Promise.reject({
        message: "No se pudo conectar al servidor. Intente de nuevo.",
      });
    } else {
      // Ocurrió algo más que no fue ni respuesta ni petición.
      return Promise.reject({ message: "Ocurrió un error inesperado." });
    }
  }
);

export default api;
