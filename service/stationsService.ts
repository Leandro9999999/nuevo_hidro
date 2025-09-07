// service/stationsService.ts
import api from "./api";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import {
  fuelStationResponseSchema,
  FuelStation,
  fuelStationCreateSchema,
  FuelStationCreate,
  fuelStationUpdateSchema,
  FuelStationUpdate,
} from "../types";
import { z } from "zod";

// Lista de estaciones (paginada)
const stationsListResponseSchema = z.object({
  data: z.array(fuelStationResponseSchema),
  total: z.number().int().nonnegative(),
});

export type StationsListResponse = z.infer<typeof stationsListResponseSchema>;

export const stationsAPI = {
  async getAll(params?: Record<string, any>): Promise<StationsListResponse> {
    const { data } = await api.get(API_ENDPOINTS.fuelStations.base, { params });
    return stationsListResponseSchema.parse(data);
  },

  async getById(id: number): Promise<FuelStation> {
    const { data } = await api.get(API_ENDPOINTS.fuelStations.byId(id));
    return fuelStationResponseSchema.parse(data);
  },

  async create(payload: FuelStationCreate): Promise<FuelStation> {
    fuelStationCreateSchema.parse(payload);
    const { data } = await api.post(API_ENDPOINTS.fuelStations.base, payload);
    return fuelStationResponseSchema.parse(data);
  },

  async update(id: number, payload: FuelStationUpdate): Promise<FuelStation> {
    fuelStationUpdateSchema.parse(payload);
    const { data } = await api.put(
      API_ENDPOINTS.fuelStations.byId(id),
      payload
    );
    return fuelStationResponseSchema.parse(data);
  },

  async remove(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(API_ENDPOINTS.fuelStations.byId(id));
    return data;
  },
};
