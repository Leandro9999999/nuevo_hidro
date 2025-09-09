"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "../../../../../../contexts/AuthContext";
import {
  FuelStation,
  Role,
  userUpdateSchema,
  UserUpdate,
} from "../../../../../../types";
import { usersAPI } from "../../../../../../service/usersService";
import { hasPermission } from "../../../../../../utils/permissions";
import { stationsAPI } from "../../../../../../service/stationsService";
import { rolesAPI } from "../../../../../../service/rolesService";

// Usamos el tipo de Zod directamente, omitiendo las propiedades que no se envían
type UserFormData = UserUpdate;

export default function EditUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const isAdmin = hasPermission(user, ["admin"]);

  // Usamos userUpdateSchema en lugar de un esquema no definido (UserSchema)
  const form = useForm<UserFormData>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchData = async () => {
      if (typeof params.id !== "string") {
        router.push("/dashboard/users");
        return;
      }

      const userId = Number(params.id);

      try {
        const [userResponse, stationsResponse, rolesResponse] =
          await Promise.all([
            usersAPI.getById(userId),
            stationsAPI.getAll({ limit: 100 }),
            rolesAPI.getAll(), // Obtener los roles de la API
          ]);

        const userData = userResponse; // La respuesta del servicio ya es el objeto de usuario
        setStations(stationsResponse.data || []);
        setRoles(rolesResponse || []);

        // El nombre de la propiedad en el formulario debe coincidir con el esquema de Zod (camelCase)
        form.reset({
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          idRole: userData.idRole,
          idFuelStation: userData.idFuelStation,
        });
      } catch (error) {
        toast.error("Error al cargar los datos del usuario");
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, isAdmin, params.id, router, form]);

  const onSubmit = async (data: UserFormData) => {
    if (typeof params.id !== "string") return;

    setIsLoading(true);
    try {
      await usersAPI.update(Number(params.id), data);
      toast.success("Usuario actualizado exitosamente");
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al actualizar el usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
    );
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
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  {...form.register("name")}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Juan"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  {...form.register("lastName")} // Propiedad en camelCase
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Pérez"
                />
                {form.formState.errors.lastName && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                {...form.register("email")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="juan@ejemplo.com"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                {...form.register("phone")}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="+591 70123456"
              />
              {form.formState.errors.phone && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Rol
              </label>
              <select
                {...form.register("idRole", { valueAsNumber: true })} // Propiedad en camelCase
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                {roles.map((role) => (
                  <option key={role.idRole} value={role.idRole}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {form.formState.errors.idRole && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.idRole.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Estación Asignada (Opcional)
              </label>
              <select
                {...form.register("idFuelStation", {
                  // Propiedad en camelCase
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                <option value="">Sin asignar</option>
                {stations.map((station) => (
                  <option
                    key={station.idFuelStation}
                    value={station.idFuelStation}
                  >
                    {station.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.idFuelStation && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.idFuelStation.message}
                </p>
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
  );
}
