"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import DashboardLayout from "@/components/dashboard-layout"
import { UserSchema } from "@/lib/schemas"
import { usersAPI, stationsAPI } from "@/lib/api"
import { useAuth, hasPermission } from "@/lib/auth"
import { z } from "zod"

const CreateUserSchema = UserSchema.omit({ id_user: true, created_at: true, updated_at: true })
  .extend({
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type CreateUserFormData = z.infer<typeof CreateUserSchema>

interface Station {
  id_fuel_station: number
  name: string
}

interface Role {
  id_role: number
  role_name: string
}

export default function NewUserPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [stations, setStations] = useState<Station[]>([])
  const [roles] = useState<Role[]>([
    { id_role: 1, role_name: "ADMIN" },
    { id_role: 2, role_name: "MANAGER" },
    { id_role: 3, role_name: "USER" },
  ])

  const isAdmin = hasPermission(user, ["ADMIN"])

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard")
    }
  }, [user, isAdmin, router])

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      id_role: 3, // Default to USER role
      id_fuel_station: undefined,
    },
  })

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await stationsAPI.getAll({ limit: 100 })
        setStations(response.data.stations || [])
      } catch (error) {
        console.error("Error fetching stations:", error)
      }
    }

    if (isAdmin) {
      fetchStations()
    }
  }, [isAdmin])

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true)
    try {
      const { confirmPassword, ...userData } = data
      await usersAPI.create(userData)
      toast.success("Usuario creado exitosamente")
      router.push("/dashboard/users")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nuevo Usuario</h1>
        <p className="text-muted-foreground">Registra un nuevo usuario en el sistema</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Contraseña</label>
                <input
                  type="password"
                  {...form.register("password")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  {...form.register("confirmPassword")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="••••••••"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
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
                {isLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
