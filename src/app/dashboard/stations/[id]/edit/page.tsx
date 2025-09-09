"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { hasPermission } from "../../../../../../utils/permissions";
import {
  fuelStationUpdateSchema,
  FuelStationUpdate,
  FuelStation,
} from "../../../../../../types";
import { stationsAPI } from "../../../../../../service/stationsService";

export default function EditStationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const canManageStations = hasPermission(user, ["admin", "manager"]);

  const form = useForm<FuelStationUpdate>({
    resolver: zodResolver(fuelStationUpdateSchema) as any,
  });

  useEffect(() => {
    if (user && !canManageStations) {
      router.push("/dashboard");
      return;
    }

    const fetchStation = async () => {
      if (!params.id) return;

      try {
        const station: FuelStation = await stationsAPI.getById(
          Number(params.id)
        );
        form.reset({
          name: station.name,
          municipality: station.municipality,
          address: station.address,
          gpsLatitude: station.gpsLatitude,
          gpsLongitude: station.gpsLongitude,
        });
      } catch (error) {
        toast.error("Error al cargar la estación");
        router.push("/dashboard/stations");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStation();
    }
  }, [user, canManageStations, params.id, router, form]);

  const onSubmit = async (data: FuelStationUpdate) => {
    if (!params.id) return;

    setIsLoading(true);
    try {
      await stationsAPI.update(Number(params.id), data);
      toast.success("Estación actualizada exitosamente");
      router.push("/dashboard/stations");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al actualizar la estación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageStations || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="text-muted-foreground mt-2">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Editar Estación</h1>
        <p className="text-muted-foreground">
          Modifica los datos de la estación
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de la Estación
              </label>
              <input
                type="text"
                {...form.register("name")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej: Estación Central La Paz"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Municipio
              </label>
              <input
                type="text"
                {...form.register("municipality")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej: La Paz"
              />
              {form.formState.errors.municipality && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.municipality.message}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Dirección
              </label>
              <textarea
                {...form.register("address")}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej: Av. 6 de Agosto #123, Zona San Pedro"
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitud GPS
                </label>
                <input
                  type="number"
                  step="any"
                  {...form.register("gpsLatitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="-16.5000"
                />
                {form.formState.errors.gpsLatitude && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.gpsLatitude.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitud GPS
                </label>
                <input
                  type="number"
                  step="any"
                  {...form.register("gpsLongitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="-68.1500"
                />
                {form.formState.errors.gpsLongitude && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.gpsLongitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-500 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Actualizando..." : "Actualizar Estación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
