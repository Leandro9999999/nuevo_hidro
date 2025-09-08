"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getFuelTypes,
  createFuelType,
  updateFuelType,
  deleteFuelType,
} from "../../../../service/fuelTypeService";
import {
  fuelTypeCreateSchema,
  FuelType,
  FuelTypeCreate,
} from "../../../../types";
import { useAuth } from "../../../..//contexts/AuthContext";
import { hasPermission } from "../../../..//utils/permissions";

export default function FuelTypesManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFuelType, setEditingFuelType] = useState<FuelType | null>(null);

  const isAdmin = hasPermission(user, ["admin"]);

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  const form = useForm<FuelTypeCreate>({
    resolver: zodResolver(fuelTypeCreateSchema),
    defaultValues: {
      fuelName: "",
      description: "",
    },
  });

  const fetchFuelTypes = async () => {
    setLoading(true);
    try {
      const data = await getFuelTypes();
      //console.log("combustible ", data);

      setFuelTypes(data);
    } catch {
      toast.error("Error al cargar los tipos de combustible");
      setFuelTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFuelTypes();
    }
  }, [isAdmin]);

  const handleSubmit = async (data: FuelTypeCreate) => {
    try {
      if (editingFuelType) {
        await updateFuelType(editingFuelType.idFuelType, data);
        toast.success("Tipo de combustible actualizado exitosamente");
      } else {
        await createFuelType(data);
        toast.success("Tipo de combustible creado exitosamente");
      }

      form.reset();
      setShowForm(false);
      setEditingFuelType(null);
      fetchFuelTypes();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Error al guardar el tipo de combustible"
      );
    }
  };

  const handleEdit = (fuelType: FuelType) => {
    setEditingFuelType(fuelType);
    form.reset({
      fuelName: fuelType.fuelName,
      description: fuelType.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el tipo de combustible "${name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteFuelType(id);
      toast.success("Tipo de combustible eliminado exitosamente");
      fetchFuelTypes();
    } catch {
      toast.error("Error al eliminar el tipo de combustible");
    }
  };

  const handleCancel = () => {
    form.reset();
    setShowForm(false);
    setEditingFuelType(null);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestión de Tipos de Combustible
            </h1>
            <p className="text-muted-foreground">
              Administra los tipos de combustible disponibles
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md font-semibold shadow hover:bg-red-700 transition-colors duration-200"
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
              {editingFuelType
                ? "Editar Tipo de Combustible"
                : "Nuevo Tipo de Combustible"}
            </h3>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Nombre del Combustible
                </label>
                <input
                  type="text"
                  {...form.register("fuelName")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Ej: Gasolina Premium"
                />
                {form.formState.errors.fuelName && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.fuelName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  {...form.register("description")}
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Descripción del tipo de combustible..."
                />
                {form.formState.errors.description && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.description.message}
                  </p>
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
                    <p className="text-muted-foreground mt-2">
                      Cargando tipos de combustible...
                    </p>
                  </td>
                </tr>
              ) : fuelTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No se encontraron tipos de combustible
                  </td>
                </tr>
              ) : (
                fuelTypes.map((fuelType) => (
                  <tr key={fuelType.idFuelType} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-card-foreground">
                        {fuelType.fuelName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {fuelType.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {fuelType.createdAt
                        ? new Date(fuelType.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(fuelType)}
                          className="text-blue-600 hover:text-black transition-all duration-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              fuelType.idFuelType!,
                              fuelType.fuelName
                            )
                          }
                          className="text-red-500 hover:text-black transition-all duration-200"
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
  );
}
