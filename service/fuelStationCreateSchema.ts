import api from "./api";
import { z } from "zod";

// 🔹 Esquema de validación con Zod
export const fuelStationBase = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(255),
  municipality: z.string().min(3, "El municipio debe tener al menos 3 caracteres").max(255),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres").max(255),
  gps_latitude: z.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  gps_longitude: z.number().min(-180, "Longitud inválida").max(180, "Longitud inválida"),
  image: z.string().url("La URL de la imagen no es válida").max(255).optional(),
});

export const fuelStationCreateSchema = fuelStationBase.extend({
  id_fuel_station: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const fuelStationUpdateSchema = fuelStationCreateSchema.partial();

// Tipos
export type FuelStationCreate = z.infer<typeof fuelStationCreateSchema>;
export type FuelStationUpdate = z.infer<typeof fuelStationUpdateSchema>;

// 🔥 Handler de errores mejorado
const handleError = (error: any, context: string) => {
  if (error.name === "ZodError") {
    console.error(`Errores de validación en ${context}:`, error.errors);
    throw error.errors.map((e: any) => e.message);
  }

  if (error.response?.data) {
    console.error(`Error de respuesta del servidor en ${context}:`, error.response.data);
    const data = error.response.data;
    // Si viene un arreglo de errores o un mensaje
    if (Array.isArray(data)) return data.map((e) => e.message || JSON.stringify(e));
    if (data.message) return [data.message];
    return [JSON.stringify(data)];
  }

  console.error(`Error en ${context}:`, error.message || error);
  throw [error.message || "Error desconocido"];
};

export const fuelStationService = {
  // Crear estación
  create: async (data: FuelStationCreate) => {
    try {
      const validated = fuelStationCreateSchema.parse(data);
      const res = await api.post("/fuel-stations", validated);
      return res.data;
    } catch (error) {
      throw handleError(error, "crear estación");
    }
  },

  // Obtener todas
  findAll: async () => {
    try {
      const res = await api.get("/fuel-stations");
      return res.data;
    } catch (error) {
      throw handleError(error, "obtener estaciones");
    }
  },

  // Obtener una por ID
  findOne: async (id: number) => {
    try {
      const res = await api.get(`/fuel-stations/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error, `obtener estación ${id}`);
    }
  },

  // Actualizar
  update: async (id: number, data: FuelStationUpdate) => {
    try {
      const validated = fuelStationUpdateSchema.parse(data);
      const res = await api.patch(`/fuel-stations/${id}`, validated);
      return res.data;
    } catch (error) {
      throw handleError(error, `actualizar estación ${id}`);
    }
  },

  // Eliminar
  remove: async (id: number) => {
    try {
      const res = await api.delete(`/fuel-stations/${id}`);
      return res.data;
    } catch (error) {
      throw handleError(error, `eliminar estación ${id}`);
    }
  },
};
