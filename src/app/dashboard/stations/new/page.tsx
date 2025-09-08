"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import DashboardLayout from "@/components/dashboard-layout";
import { stationsAPI } from "../../../../../service/stationsService";
import {
  FuelStationCreate,
  fuelStationCreateSchema,
} from "../../../../../types";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission } from "../../../../../utils/permissions";

export default function NewStationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const canManageStations = hasPermission(user, ["admin", "manager"]);

  // Redirige si no tiene permiso
  useEffect(() => {
    if (user && !canManageStations) {
      router.push("/dashboard");
    }
  }, [user, canManageStations, router]);

  const form = useForm<FuelStationCreate>({
    resolver: zodResolver(fuelStationCreateSchema),
    defaultValues: {
      name: "",
      municipality: "",
      address: "",
      gpsLatitude: 0,
      gpsLongitude: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FuelStationCreate) => {
    setIsLoading(true);
    try {
      await stationsAPI.create(data);
      toast.success("Estación creada exitosamente");
      router.push("/dashboard/stations");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al crear la estación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageStations) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nueva Estación</h1>
        <p className="text-muted-foreground">
          Registra una nueva estación de combustible
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Nombre de la Estación
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: Estación Central La Paz"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Municipio
              </label>
              <input
                type="text"
                {...register("municipality")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: La Paz"
              />
              {errors.municipality && (
                <p className="text-destructive text-sm mt-1">
                  {errors.municipality.message}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Dirección
              </label>
              <textarea
                {...register("address")}
                rows={3}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: Av. 6 de Agosto #123, Zona San Pedro"
              />
              {errors.address && (
                <p className="text-destructive text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Latitud GPS
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("gpsLatitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="-16.5000"
                />
                {errors.gpsLatitude && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.gpsLatitude.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Longitud GPS
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("gpsLongitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="-68.1500"
                />
                {errors.gpsLongitude && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.gpsLongitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Creando..." : "Crear Estación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
