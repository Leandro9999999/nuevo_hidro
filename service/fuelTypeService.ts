// src/service/fuelTypeService.ts
import api from "./api";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import { FuelType, FuelTypeCreate, FuelTypeUpdate } from "../types";

// Obtener todos los tipos de combustible
export const getFuelTypes = async (): Promise<FuelType[]> => {
  const { data } = await api.get<FuelType[]>(API_ENDPOINTS.fuelTypes.base);
  return data;
};

// Obtener un tipo de combustible por ID
export const getFuelTypeById = async (id: number): Promise<FuelType> => {
  const { data } = await api.get<FuelType>(API_ENDPOINTS.fuelTypes.byId(id));
  return data;
};

// Crear un nuevo tipo de combustible
export const createFuelType = async (
  payload: FuelTypeCreate
): Promise<FuelType> => {
  const { data } = await api.post<FuelType>(
    API_ENDPOINTS.fuelTypes.base,
    payload
  );
  return data;
};

// Actualizar un tipo de combustible
export const updateFuelType = async (
  id: number,
  payload: FuelTypeUpdate
): Promise<FuelType> => {
  const { data } = await api.patch<FuelType>(
    API_ENDPOINTS.fuelTypes.byId(id),
    payload
  );
  return data;
};

// Eliminar un tipo de combustible
export const deleteFuelType = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.fuelTypes.byId(id));
};
