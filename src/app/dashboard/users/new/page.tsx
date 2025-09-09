"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission } from "../../../../../utils/permissions";
import { usersAPI } from "../../../../../service/usersService";
import { stationsAPI } from "../../../../../service/stationsService";
import { rolesAPI } from "../../../../../service/rolesService";
import {
  FuelStation,
  Role,
  userCreateSchema,
  UserCreate,
} from "../../../../../types";

// Extendemos el schema para incluir confirmPassword solo en el frontend
const createUserSchemaWithConfirm = userCreateSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, "La confirmación debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type CreateUserFormData = z.infer<typeof createUserSchemaWithConfirm>;

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const isAdmin = hasPermission(user, ["admin"]);

  // Redirigir si no es admin
  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchemaWithConfirm),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      idRole: 3, // Default USER
      idFuelStation: undefined,
    },
  });

  // Cargar estaciones y roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, rolesRes] = await Promise.all([
          stationsAPI.getAll({ limit: 100 }),
          rolesAPI.getAll(),
        ]);
        setStations(stationsRes.data || []);
        setRoles(rolesRes || []);

        // Si existe el rol "user", ponerlo como default
        const userRole = rolesRes.find(
          (r) => r.roleName.toLowerCase() === "user"
        );
        if (userRole) {
          form.setValue("idRole", userRole.idRole);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar estaciones o roles");
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, form]);

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await usersAPI.create(userData as UserCreate);
      toast.success("Usuario creado exitosamente");
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nuevo Usuario</h1>
        <p className="text-muted-foreground">
          Registra un nuevo usuario en el sistema
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                form={form}
                name="name"
                label="Nombre"
                placeholder="Juan"
              />
              <InputField
                form={form}
                name="lastName"
                label="Apellido"
                placeholder="Pérez"
              />
            </div>

            {/* Email */}
            <InputField
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="juan@ejemplo.com"
            />

            {/* Teléfono */}
            <InputField
              form={form}
              name="phone"
              label="Teléfono (Opcional)"
              type="tel"
              placeholder="+591 70123456"
            />

            {/* Contraseña y Confirmación */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                form={form}
                name="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
              />
              <InputField
                form={form}
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
              />
            </div>

            {/* Rol */}
            <SelectField
              form={form}
              name="idRole"
              label="Rol"
              options={roles.map((r) => ({
                value: r.idRole,
                label: r.roleName,
              }))}
              parseValue={(value: string) => Number(value)}
            />

            {/* Estación */}
            <SelectField
              form={form}
              name="idFuelStation"
              label="Estación Asignada (Opcional)"
              options={[
                { value: "", label: "Sin asignar" },
                ...stations.map((s) => ({
                  value: s.idFuelStation,
                  label: s.name,
                })),
              ]}
              parseValue={(value: string) =>
                value === "" ? undefined : Number(value)
              }
            />

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50"
              >
                {isLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Componente reutilizable para inputs de texto
 */
function InputField({ form, name, label, type = "text", placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        {...form.register(name)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md"
      />
      {form.formState.errors[name] && (
        <p className="text-destructive text-sm mt-1">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}

/**
 * Componente reutilizable para selects
 */
function SelectField({ form, name, label, options, parseValue }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        {...form.register(name, parseValue ? { setValueAs: parseValue } : {})}
        className="w-full px-3 py-2 border rounded-md"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {form.formState.errors[name] && (
        <p className="text-destructive text-sm mt-1">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
