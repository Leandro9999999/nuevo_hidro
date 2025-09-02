import { z } from "zod";

// Modelo FuelStation
const fuelStationBase = z.object({
  name: z.string().max(255),
  municipality: z.string().max(255),
  address: z.string().max(255),
  gps_latitude: z.number().min(-90).max(90),
  gps_longitude: z.number().min(-180).max(180),
});
export const fuelStationCreateSchema = fuelStationBase.extend({
  id_fuel_station: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const fuelStationUpdateSchema = fuelStationCreateSchema.partial();

// Modelo FuelType
const fuelTypeBase = z.object({
  fuel_name: z.string().max(50),
  description: z.string().max(255),
});
export const fuelTypeCreateSchema = fuelTypeBase.extend({
  id_fuel_type: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const fuelTypeUpdateSchema = fuelTypeCreateSchema.partial();

// Modelo FuelAvailability
const fuelAvailabilityBase = z.object({
  available_quantity: z.number().nonnegative(),
  id_fuel_station: z.number().int().positive(),
  id_fuel_type: z.number().int().positive(),
});
export const fuelAvailabilityCreateSchema = fuelAvailabilityBase.extend({
  id_fuel_availability: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const fuelAvailabilityUpdateSchema =
  fuelAvailabilityCreateSchema.partial();

// Modelo Role
const roleBase = z.object({
  role_name: z.string().max(50),
  description: z.string().max(255),
});
export const roleCreateSchema = roleBase.extend({
  id_role: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const roleUpdateSchema = roleCreateSchema.partial();

// Modelo User
const userBase = z.object({
  name: z.string().max(255),
  lasrname: z.string().max(255).optional(),
  email: z.string().email().max(255),
  password: z.string().max(255),
  phone: z.string().max(20),
  id_role: z.number().int().positive(),
  id_fuel_station: z.number().int().positive().nullable().optional(),
});
export const userCreateSchema = userBase.extend({
  id_user: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const userUpdateSchema = userCreateSchema.partial();

// Modelo UserStationNotification
const userStationNotificationBase = z.object({
  subscribed: z.boolean(),
  id_user: z.number().int().positive(),
  id_fuel_station: z.number().int().positive(),
});
export const userStationNotificationCreateSchema =
  userStationNotificationBase.extend({
    id_user_station_notification: z.number().int().positive().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  });
export const userStationNotificationUpdateSchema =
  userStationNotificationCreateSchema.partial();

// Modelo StationImage
const stationImageBase = z.object({
  image_url: z.string().url().max(255),
  description: z.string().max(255),
  id_fuel_station: z.number().int().positive(),
});
export const stationImageCreateSchema = stationImageBase.extend({
  id_station_image: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const stationImageUpdateSchema = stationImageCreateSchema.partial();
