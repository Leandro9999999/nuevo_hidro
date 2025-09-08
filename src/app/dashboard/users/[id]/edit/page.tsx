"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { toast } from "react-toastify"
import DashboardLayout from "@/components/dashboard-layout"
import { UserSchema } from "@/lib/schemas"
import { usersAPI, stationsAPI } from "@/lib/api"
import { useAuth, hasPermission } from "@/lib/auth"

type UserFormData = Omit<typeof UserSchema._type, "id_user" | "created_at" | "updated_at" | "password">

interface Station {
  id_fuel_station: number
  name: string
}

interface Role {
  id_role: number
  role_name: string
}

export default function EditUserPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stations, setStations] = useState<Station[]>([])
  const [roles] = useState<Role[]>([
    { id_role: 1, role_name: "admin" },
    { id_role: 2, role_name: "manager" },
    { id_role: 3, role_name: "user" },
  ])

  const isAdmin = hasPermission(user, ["admin"])

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema.omit({ id_user: true, created_at: true, updated_at: true, password: true })),
  })

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard")
      return
    }

    const fetchData = async () => {
      if (!params.id) return

      try {
        const [userResponse, stationsResponse] = await Promise.all([
          usersAPI.getById(Number(params.id)),
          stationsAPI.getAll({ limit: 100 }),
        ])

        const userData = userResponse.data
        setStations(stationsResponse.data.stations || [])

        form.reset({
          name: userData.name,
          last_name: userData.last_name || "",
          email: userData.email,
          phone: userData.phone || "",
          id_role: userData.role.id_role,
          id_fuel_station: userData.fuel_station?.id_fuel_station,
        })
      } catch (error) {
        toast.error("Error al cargar el usuario")
        router.push("/dashboard/users")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, isAdmin, params.id, router, form])

  const onSubmit = async (data: UserFormData) => {
    if (!params.id) return

    setIsLoading(true)
    try {
      await usersAPI.update(Number(params.id), data)
      toast.success("Usuario actualizado exitosamente")
      router.push("/dashboard/users")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al actualizar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin || loading) {
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
        <h1 className="text-2xl font-bold text-foreground">Editar Usuario</h1>
        <p className="text-muted-foreground">Modifica los datos del usuario</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Nombre</label>
                <input
                  type="text"
                  {...form.register("name")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Juan"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Apellido</label>
                <input
                  type="text"
                  {...form.register("last_name")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Pérez"
                />
                {form.formState.errors.last_name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Email</label>
              <input
                type="email"
                {...form.register("email")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="juan@ejemplo.com"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Teléfono (Opcional)</label>
              <input
                type="tel"
                {...form.register("phone")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="+591 70123456"
              />
              {form.formState.errors.phone && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Rol</label>
              <select
                {...form.register("id_role", { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                {roles.map((role) => (
                  <option key={role.id_role} value={role.id_role}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              {form.formState.errors.id_role && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.id_role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Estación Asignada (Opcional)
              </label>
              <select
                {...form.register("id_fuel_station", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                <option value="">Sin asignar</option>
                {stations.map((station) => (
                  <option key={station.id_fuel_station} value={station.id_fuel_station}>
                    {station.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.id_fuel_station && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.id_fuel_station.message}</p>
              )}
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
                {isLoading ? "Actualizando..." : "Actualizar Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
