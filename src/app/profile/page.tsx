"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout";
import { userUpdateSchema, UserUpdate, User } from "../../../types";
import { usersAPI } from "../../../service/usersService";
import { useAuth } from "../../../contexts/AuthContext";
import { z } from "zod";

// Usamos el esquema de Zod ya definido en tus tipos
// Excluimos `password` ya que se maneja en un formulario separado
const profileSchema = userUpdateSchema.omit({ password: true });

// Esquema para la actualización de contraseña
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Tipos derivados directamente de los esquemas
type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// Función para manejar las actualizaciones y reducir la duplicación de código
const handleUpdate = async (
  apiCall: () => Promise<any>,
  successMessage: string,
  setLoading: (value: boolean) => void,
  resetForm: () => void
) => {
  setLoading(true);
  try {
    await apiCall();
    toast.success(successMessage);
    resetForm();
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Ocurrió un error");
  } finally {
    setLoading(false);
  }
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Cargar datos de perfil una vez que el usuario esté disponible
  useEffect(() => {
    // Es crucial que 'user' se haya cargado completamente del contexto
    if (user) {
      profileForm.reset({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        //phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    handleUpdate(
      () => usersAPI.update(user.id, data), // Correcto: `user.id`
      "Perfil actualizado exitosamente",
      setIsLoadingProfile,
      () => {
        // En este caso, recargamos la página para actualizar el AuthContext
        window.location.reload();
      }
    );
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!user) return;
    handleUpdate(
      () =>
        usersAPI.update(user.id, {
          password: data.newPassword,
          //currentPassword: data.currentPassword,
        }),
      "Contraseña actualizada exitosamente",
      setIsLoadingPassword,
      () => passwordForm.reset()
    );
  };

  if (!user) {
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

  // Componente Input reutilizable para reducir la duplicación de código
  const InputField = ({
    form,
    name,
    label,
    type = "text",
    placeholder,
  }: any) => (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        {...form.register(name)}
        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
        placeholder={placeholder}
      />
      {form.formState.errors[name] && (
        <p className="text-destructive text-sm mt-1">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Información Personal
          </h2>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <InputField
                form={profileForm}
                name="name"
                label="Nombre"
                placeholder="Juan"
              />
              <InputField
                form={profileForm}
                name="lastName"
                label="Apellido"
                placeholder="Pérez"
              />
            </div>

            <InputField
              form={profileForm}
              name="email"
              label="Email"
              type="email"
              placeholder="juan@ejemplo.com"
            />
            <InputField
              form={profileForm}
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="+591 70123456"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoadingProfile}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingProfile ? "Actualizando..." : "Actualizar Perfil"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Cambiar Contraseña
          </h2>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            {/* <InputField
              form={passwordForm}
              name="currentPassword"
              label="Contraseña Actual"
              type="password"
              placeholder="••••••••"
            /> */}
            <InputField
              form={passwordForm}
              name="newPassword"
              label="Nueva Contraseña"
              type="password"
              placeholder="••••••••"
            />
            <InputField
              form={passwordForm}
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoadingPassword}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingPassword ? "Actualizando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-8 bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Información de la Cuenta
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-2">
              Rol
            </h3>
            <p className="text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={logout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
