// src/types/index.ts
import { z } from "zod";

/* =========================================================
   FuelStation
   ========================================================= */
const fuelStationBase = z.object({
  name: z.string().min(2).max(255),
  municipality: z.string().min(2).max(255),
  address: z.string().min(2).max(255),
  gpsLatitude: z.coerce.number().min(-90).max(90),
  gpsLongitude: z.coerce.number().min(-180).max(180),
});

// Schemas
export const fuelStationCreateSchema = fuelStationBase;
export const fuelStationUpdateSchema = fuelStationBase.partial();
export const fuelStationResponseSchema = fuelStationBase.extend({
  idFuelStation: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Tipos
export type FuelStationCreate = z.infer<typeof fuelStationCreateSchema>;
export type FuelStationUpdate = z.infer<typeof fuelStationUpdateSchema>;
export type FuelStation = z.infer<typeof fuelStationResponseSchema>;

/* =========================================================
   FuelType
   ========================================================= */
const fuelTypeBase = z.object({
  fuelName: z.string().min(2).max(50),
  description: z.string().min(2).max(255),
});

export const fuelTypeCreateSchema = fuelTypeBase;
export const fuelTypeUpdateSchema = fuelTypeBase.partial();
export const fuelTypeResponseSchema = fuelTypeBase.extend({
  idFuelType: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FuelTypeCreate = z.infer<typeof fuelTypeCreateSchema>;
export type FuelTypeUpdate = z.infer<typeof fuelTypeUpdateSchema>;
export type FuelType = z.infer<typeof fuelTypeResponseSchema>;

/* =========================================================
   FuelAvailability
   ========================================================= */
const fuelAvailabilityBase = z.object({
  availableQuantity: z.coerce.number().nonnegative(),
  idFuelStation: z.number().int().positive(),
  idFuelType: z.number().int().positive(),
});

export const fuelAvailabilityCreateSchema = fuelAvailabilityBase;
export const fuelAvailabilityUpdateSchema = fuelAvailabilityBase.partial();
export const fuelAvailabilityResponseSchema = fuelAvailabilityBase.extend({
  idFuelAvailability: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FuelAvailabilityCreate = z.infer<
  typeof fuelAvailabilityCreateSchema
>;
export type FuelAvailabilityUpdate = z.infer<
  typeof fuelAvailabilityUpdateSchema
>;
export type FuelAvailability = z.infer<typeof fuelAvailabilityResponseSchema>;

/* =========================================================
   Role
   ========================================================= */
const roleBase = z.object({
  roleName: z.string().min(2).max(50),
  description: z.string().max(255).nullable().optional(),
});

export const roleCreateSchema = roleBase;
export const roleUpdateSchema = roleBase.partial();
export const roleResponseSchema = roleBase.extend({
  idRole: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;
export type Role = z.infer<typeof roleResponseSchema>;

/* =========================================================
   User
   ========================================================= */
const userBase = z.object({
  name: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255).optional(),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  phone: z.string().max(20).nullable().optional(),
  idRole: z.number().int().positive().optional(),
  idFuelStation: z.number().int().positive().nullable().optional(),
});

export const userCreateSchema = userBase;
export const userUpdateSchema = userBase.partial();
export const userResponseSchema = userBase.extend({
  idUser: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type User = z.infer<typeof userResponseSchema>;

/* =========================================================
   UserStationNotification
   ========================================================= */
const userStationNotificationBase = z.object({
  subscribed: z.boolean(),
  idUser: z.number().int().positive(),
  idFuelStation: z.number().int().positive(),
});

export const userStationNotificationCreateSchema = userStationNotificationBase;
export const userStationNotificationUpdateSchema =
  userStationNotificationBase.partial();
export const userStationNotificationResponseSchema =
  userStationNotificationBase.extend({
    idUserStationNotification: z.number().int().positive(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });

export type UserStationNotificationCreate = z.infer<
  typeof userStationNotificationCreateSchema
>;
export type UserStationNotificationUpdate = z.infer<
  typeof userStationNotificationUpdateSchema
>;
export type UserStationNotification = z.infer<
  typeof userStationNotificationResponseSchema
>;

/* =========================================================
   StationImage
   ========================================================= */
const stationImageBase = z.object({
  imageUrl: z.string().url().max(255),
  description: z.string().max(255).nullable().optional(),
  idFuelStation: z.number().int().positive(),
});

export const stationImageCreateSchema = stationImageBase;
export const stationImageUpdateSchema = stationImageBase.partial();
export const stationImageResponseSchema = stationImageBase.extend({
  idStationImage: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type StationImageCreate = z.infer<typeof stationImageCreateSchema>;
export type StationImageUpdate = z.infer<typeof stationImageUpdateSchema>;
export type StationImage = z.infer<typeof stationImageResponseSchema>;

/* =========================================================
   Login
   ========================================================= */
export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo electrónico no tiene un formato válido")
    .max(255)
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .refine((val) => /\S/.test(val), {
      message: "La contraseña no puede contener solo espacios",
    })
    .transform((val) => val.trim()),
});

export type Login = z.infer<typeof loginSchema>;

/* =========================================================
   SessionUser
   ========================================================= */
export const sessionUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string(), // string para mantenerlo plano en el contexto
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

/* =========================================================
   RegisterResponse
   ========================================================= */
export const registerResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    idUser: z.number(),
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().nullable().optional(),
    refreshToken: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    resetToken: z.string().nullable().optional(),
    tokenExpiration: z.string().nullable().optional(),
    role: roleResponseSchema,
  }),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

/* =========================================================
   LoginResponse
   ========================================================= */
export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    role: z.string(),
  }),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
