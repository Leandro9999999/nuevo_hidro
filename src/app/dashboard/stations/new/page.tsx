"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import DashboardLayout from "@/components/dashboard-layout"
import { FuelStationSchema, type FuelStation } from "@/lib/schemas"
import { stationsAPI } from "@/lib/api"
import { useAuth, hasPermission } from "@/lib/auth"
import { useEffect } from "react"

type StationFormData = Omit<FuelStation, "id_fuel_station" | "created_at" | "updated_at">

export default function NewStationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const canManageStations = hasPermission(user, ["ADMIN", "MANAGER"])

  useEffect(() => {
    if (user && !canManageStations) {
      router.push("/dashboard")
    }
  }, [user, canManageStations, router])

  const form = useForm<StationFormData>({
    resolver: zodResolver(FuelStationSchema.omit({ id_fuel_station: true, created_at: true, updated_at: true })),
    defaultValues: {
      name: "",
      municipality: "",
      address: "",
      gps_latitude: 0,
      gps_longitude: 0,
    },
  })

  const onSubmit = async (data: StationFormData) => {
    setIsLoading(true)
    try {
      await stationsAPI.create(data)
      toast.success("Estación creada exitosamente")
      router.push("/dashboard/stations")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear la estación")
    } finally {
      setIsLoading(false)
    }
  }

  if (!canManageStations) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nueva Estación</h1>
        <p className="text-muted-foreground">Registra una nueva estación de combustible</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Nombre de la Estación</label>
              <input
                type="text"
                {...form.register("name")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: Estación Central La Paz"
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Municipio</label>
              <input
                type="text"
                {...form.register("municipality")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: La Paz"
              />
              {form.formState.errors.municipality && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.municipality.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Dirección</label>
              <textarea
                {...form.register("address")}
                rows={3}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ej: Av. 6 de Agosto #123, Zona San Pedro"
              />
              {form.formState.errors.address && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Latitud GPS</label>
                <input
                  type="number"
                  step="any"
                  {...form.register("gps_latitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="-16.5000"
                />
                {form.formState.errors.gps_latitude && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.gps_latitude.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Longitud GPS</label>
                <input
                  type="number"
                  step="any"
                  {...form.register("gps_longitude", { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="-68.1500"
                />
                {form.formState.errors.gps_longitude && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.gps_longitude.message}</p>
                )}
              </div>
            </div>

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
  )
}
