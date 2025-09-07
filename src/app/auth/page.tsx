"use client";

import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  loginSchema,
  userCreateSchema,
  Login,
  UserCreate,
} from "../../../types";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const {
    register: registerInput,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Login | UserCreate>({
    resolver: zodResolver(isLogin ? loginSchema : userCreateSchema),
  });

  const onSubmit = async (formData: Login | UserCreate) => {
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData as Login);
        toast.success("Inicio de sesión exitoso ✅");
      } else {
        await register(formData as UserCreate);
        toast.success("Registro exitoso ✅");
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error en auth:", err);
      toast.error(err.message || "Ocurrió un error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-green-100 px-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-red-600">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                {...registerInput("name")}
                className={`w-full px-4 py-2 border rounded-xl text-black bg-white ${
                  (errors as FieldErrors<UserCreate>).name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {(errors as FieldErrors<UserCreate>).name && (
                <p className="text-red-600 text-sm mt-1">
                  {(errors as FieldErrors<UserCreate>).name?.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              {...registerInput("email")}
              className={`w-full px-4 py-2 border rounded-xl text-black bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...registerInput("password")}
              className={`w-full px-4 py-2 border rounded-xl text-black bg-white ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Procesando..." : isLogin ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-red-600 font-semibold hover:underline"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
