// constants/api-endpoints.ts

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  users: {
    base: "/users",
    byId: (id: number | string) => `/users/${id}`,
  },
  roles: {
    base: "/roles",
    byId: (id: number | string) => `/roles/${id}`,
  },
  fuelStations: {
    base: "/fuel-stations",
    byId: (id: number | string) => `/fuel-stations/${id}`,
  },
  fuelTypes: {
    base: "/fuel-types",
    byId: (id: number | string) => `/fuel-types/${id}`,
  },
  fuelAvailabilities: {
    base: "/fuel-availabilities",
    byId: (id: number | string) => `/fuel-availabilities/${id}`,
  },
  stationImages: {
    base: "/station-images",
    byId: (id: number | string) => `/station-images/${id}`,
  },
  userStationNotifications: {
    base: "/user-station-notifications",
    byId: (id: number | string) => `/user-station-notifications/${id}`,
  },
  health: "/health",
};
