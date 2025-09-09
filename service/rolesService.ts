// service/rolesService.ts
import api from "./api";
import {
  roleCreateSchema,
  roleResponseSchema,
  roleUpdateSchema,
  Role,
  RoleCreate,
  RoleUpdate,
} from "../types";
import { API_ENDPOINTS } from "../constants/api-endpoints";

/**
 * Servicio para manejo de roles.
 * Validación centralizada con Zod para entrada y salida.
 */
export const rolesAPI = {
  async getAll(): Promise<Role[]> {
    const { data } = await api.get(API_ENDPOINTS.roles.base);
    // Valida la respuesta como array de roles
    if (!Array.isArray(data)) throw new Error("Respuesta inválida para roles");
    return data.map((role) => roleResponseSchema.parse(role)); // Validar cada rol
  },

  async getById(id: number): Promise<Role> {
    const { data } = await api.get(API_ENDPOINTS.roles.byId(id));
    return roleResponseSchema.parse(data);
  },

  async create(payload: RoleCreate): Promise<Role> {
    // Validar entrada
    roleCreateSchema.parse(payload);
    const { data } = await api.post(API_ENDPOINTS.roles.base, payload);
    return roleResponseSchema.parse(data);
  },

  async update(id: number, payload: RoleUpdate): Promise<Role> {
    // Validar entrada parcial para actualización
    roleUpdateSchema.parse(payload);
    const { data } = await api.patch(API_ENDPOINTS.roles.byId(id), payload);
    return roleResponseSchema.parse(data);
  },

  async remove(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(API_ENDPOINTS.roles.byId(id));
    return data;
  },
};
