"use client"

import { useState, useEffect } from "react"
import { useAuth, hasPermission } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { fuelTypesAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FuelTypeSchema, type FuelType } from "@/lib/schemas"

type FuelTypeFormData = Omit<FuelType, "id_fuel_type" | "created_at" | "updated_at">

export default function FuelTypesManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFuelType, setEditingFuelType] = useState<FuelType | null>(null)

  const isAdmin = hasPermission(user, ["ADMIN"])

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard")
    }
  }, [user, isAdmin, router])

  const form = useForm<FuelTypeFormData>({
    resolver: zodResolver(FuelTypeSchema.omit({ id_fuel_type: true, created_at: true, updated_at: true })),
    defaultValues: {
      fuel_name: "",
      description: "",
    },
  })

  const fetchFuelTypes = async () => {
    setLoading(true)
    try {
      const response = await fuelTypesAPI.getAll()
      setFuelTypes(response.data || [])
    } catch (error) {
      toast.error("Error al cargar los tipos de combustible")
      setFuelTypes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchFuelTypes()
    }
  }, [isAdmin])

  const handleSubmit = async (data: FuelTypeFormData) => {
    try {
      if (editingFuelType) {
        await fuelTypesAPI.update(editingFuelType.id_fuel_type!, data)
        toast.success("Tipo de combustible actualizado exitosamente")
      } else {
        await fuelTypesAPI.create(data)
        toast.success("Tipo de combustible creado exitosamente")
      }

      form.reset()
      setShowForm(false)
      setEditingFuelType(null)
      fetchFuelTypes()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al guardar el tipo de combustible")
    }
  }

  const handleEdit = (fuelType: FuelType) => {
    setEditingFuelType(fuelType)
    form.reset({
      fuel_name: fuelType.fuel_name,
      description: fuelType.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el tipo de combustible "${name}"?`)) {
      return
    }

    try {
      await fuelTypesAPI.delete(id)
      toast.success("Tipo de combustible eliminado exitosamente")
      fetchFuelTypes()
    } catch (error) {
      toast.error("Error al eliminar el tipo de combustible")
    }
  }

  const handleCancel = () => {
    form.reset()
    setShowForm(false)
    setEditingFuelType(null)
  }

  if (!isAdmin) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Tipos de Combustible</h1>
            <p className="text-muted-foreground">Administra los tipos de combustible disponibles</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              Nuevo Tipo de Combustible
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              {editingFuelType ? "Editar Tipo de Combustible" : "Nuevo Tipo de Combustible"}
            </h3>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Nombre del Combustible</label>
                <input
                  type="text"
                  {...form.register("fuel_name")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Ej: Gasolina Premium"
                />
                {form.formState.errors.fuel_name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.fuel_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Descripción (Opcional)</label>
                <textarea
                  {...form.register("description")}
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Descripción del tipo de combustible..."
                />
                {form.formState.errors.description && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
                >
                  {editingFuelType ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Types List */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    <p className="text-muted-foreground mt-2">Cargando tipos de combustible...</p>
                  </td>
                </tr>
              ) : fuelTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                    No se encontraron tipos de combustible
                  </td>
                </tr>
              ) : (
                fuelTypes.map((fuelType) => (
                  <tr key={fuelType.id_fuel_type} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-card-foreground">{fuelType.fuel_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">{fuelType.description || "Sin descripción"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {fuelType.created_at ? new Date(fuelType.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(fuelType)} className="text-blue-600 hover:text-blue-500">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(fuelType.id_fuel_type!, fuelType.fuel_name)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
