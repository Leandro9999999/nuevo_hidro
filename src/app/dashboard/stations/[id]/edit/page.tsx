"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { toast } from "react-toastify"
import DashboardLayout from "@/components/dashboard-layout"

type StationFormData = Omit<FuelStation, "id_fuel_station" | "created_at" | "updated_at">

export default function EditStationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const canManageStations = hasPermission(user, ["admin", "maanger"])

  const form = useForm<StationFormData>({
    resolver: zodResolver(FuelStationSchema.omit({ id_fuel_station: true, created_at: true, updated_at: true })),
  })

  useEffect(() => {
    if (user && !canManageStations) {
      router.push("/dashboard")
      return
    }

    const fetchStation = async () => {
      if (!params.id) return

      try {
        const response = await stationsAPI.getById(Number(params.id))
        const station = response.data
        form.reset({
          name: station.name,
          municipality: station.municipality,
          address: station.address,
          gps_latitude: station.gps_latitude,
          gps_longitude: station.gps_longitude,
        })
      } catch (error) {
        toast.error("Error al cargar la estación")
        router.push("/dashboard/stations")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStation()
    }
  }, [user, canManageStations, params.id, router, form])

  const onSubmit = async (data: StationFormData) => {
    if (!params.id) return

    setIsLoading(true)
    try {
      await stationsAPI.update(Number(params.id), data)
      toast.success("Estación actualizada exitosamente")
      router.push("/dashboard/stations")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al actualizar la estación")
    } finally {
      setIsLoading(false)
    }
  }

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
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Editar Estación</h1>
        <p className="text-muted-foreground">Modifica los datos de la estación</p>
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
                {isLoading ? "Actualizando..." : "Actualizar Estación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
