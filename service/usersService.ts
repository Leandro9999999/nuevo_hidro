// service/usersService.ts
import api from "./api";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import {
  userResponseSchema,
  User,
  userCreateSchema,
  UserCreate,
  userUpdateSchema,
  UserUpdate,
} from "../types";
import { z } from "zod";

// Lista de usuarios (paginada)
const usersListResponseSchema = z.object({
  data: z.array(userResponseSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageCount: z.number().int().nonnegative(),
});

export type UsersListResponse = z.infer<typeof usersListResponseSchema>;

export const usersAPI = {
  async getAll(params?: Record<string, any>): Promise<UsersListResponse> {
    const { data } = await api.get(API_ENDPOINTS.users.base, { params });
    return usersListResponseSchema.parse(data);
  },

  async getById(id: number): Promise<User> {
    const { data } = await api.get(API_ENDPOINTS.users.byId(id));
    return userResponseSchema.parse(data);
  },

  async create(payload: UserCreate): Promise<User> {
    userCreateSchema.parse(payload); // validación previa
    const { data } = await api.post(API_ENDPOINTS.users.base, payload);
    return userResponseSchema.parse(data);
  },

  async update(id: number, payload: UserUpdate): Promise<User> {
    userUpdateSchema.parse(payload);
    const { data } = await api.patch(API_ENDPOINTS.users.byId(id), payload);
    return userResponseSchema.parse(data);
  },

  async remove(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(API_ENDPOINTS.users.byId(id));
    return data;
  },
};
