"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { hasPermission } from "../../../../utils/permissions";
import { usersAPI } from "../../../../service/usersService";
import { User } from "../../../../types"; // Importamos el tipo User desde los tipos

export default function UsersManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = hasPermission(user, ["admin"]);

  // Redirigir si el usuario no tiene permisos de administrador
  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/dashboard");
    }
  }, [user, isAdmin, router]);

  // Función para cargar los usuarios paginados
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll({
        page,
        limit: 10,
      });
      // El servicio ya valida y tipa los datos con Zod
      setUsers(response.data || []);
      setTotalPages(response.pageCount); // Usamos pageCount del response de la API
    } catch (error) {
      toast.error("Error al cargar los usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers(currentPage);
    }
  }, [currentPage, isAdmin]);

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar al usuario "${name}"?`)
    ) {
      return;
    }

    try {
      await usersAPI.remove(id); // Cambiamos el nombre de la función a 'remove'
      toast.success("Usuario eliminado exitosamente");
      fetchUsers(currentPage);
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    }
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
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground">
              Administra los usuarios del sistema
            </p>
          </div>
          <Link
            href="/dashboard/users/new"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
          >
            Nuevo Usuario
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estación Asignada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    <p className="text-muted-foreground mt-2">
                      Cargando usuarios...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData.idUser} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {userData.name} {userData.lastName}
                        </div>
                        {userData.phone && (
                          <div className="text-sm text-muted-foreground">
                            {userData.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userData.idRole === 1
                            ? "bg-red-100 text-red-800"
                            : userData.idRole === 2
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {
                          // Se muestra el nombre del rol si existe
                          userData.role?.roleName || "No especificado"
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {userData.idFuelStation
                        ? userData.idFuelStation
                        : "No asignada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Se corrige la propiedad id_user a idUser */}
                        <Link
                          href={`/dashboard/users/${userData.idUser}/edit`}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Editar
                        </Link>
                        {userData.idUser !== user?.id && (
                          <button
                            onClick={() =>
                              handleDelete(userData.idUser, userData.name)
                            }
                            className="text-destructive hover:text-destructive/80"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-muted px-6 py-3 flex items-center justify-between border-t border-border">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-muted-foreground bg-background hover:bg-muted disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-muted-foreground bg-background hover:bg-muted disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
