"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { hasPermission } from "../../../../utils/permissions";
import { useAuth } from "../../../..//contexts/AuthContext";
import { stationsAPI } from "../../../..//service/stationsService";
import type { FuelStation } from "../../../../types";

export default function StationsManagementPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stations, setStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const canManageStations = hasPermission(user, ["admin", "maanger"]);

  useEffect(() => {
    if (!user) return;
    if (!canManageStations) router.push("/dashboard");
  }, [user, canManageStations, router]);

  const fetchStations = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const { data, total } = await stationsAPI.getAll({
        page,
        limit: 10,
        search: searchTerm,
      });

      setStations(data);
      setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      toast.error("Error al cargar las estaciones");
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageStations) {
      fetchStations(currentPage, search);
    }
  }, [currentPage, search, canManageStations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStations(1, search);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar la estación "${name}"?`)
    ) {
      return;
    }

    try {
      await stationsAPI.remove(id);
      toast.success("Estación eliminada exitosamente");
      fetchStations(currentPage, search);
    } catch (error) {
      toast.error("Error al eliminar la estación");
    }
  };

  if (!canManageStations) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestión de Estaciones
            </h1>
            <p className="text-muted-foreground">
              Administra las estaciones de combustible
            </p>
          </div>
          {canManageStations && (
            <Link
              href="/dashboard/stations/new"
              className="bg-red-600 inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-md font-semibold shadow hover:bg-red-700 transition-colors duration-200"
            >
              Nueva Estación
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o municipio..."
            className="flex-1 px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
          <button
            type="submit"
            className="bg-red-600 inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-md font-semibold shadow hover:bg-red-700 transition-colors duration-200"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Stations Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Coordenadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha Creación
                </th>
                {canManageStations && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={canManageStations ? 5 : 4}
                    className="px-6 py-4 text-center"
                  >
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    <p className="text-muted-foreground mt-2">
                      Cargando estaciones...
                    </p>
                  </td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManageStations ? 5 : 4}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No se encontraron estaciones
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station.idFuelStation} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {station.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {station.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {station.municipality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {station.gpsLatitude.toFixed(4)},{" "}
                      {station.gpsLongitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(station.createdAt).toLocaleDateString()}
                    </td>
                    {canManageStations && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/dashboard/stations/${station.idFuelStation}`}
                            className="text-accent hover:text-accent/80"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/dashboard/stations/${station.idFuelStation}/edit`}
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(station.idFuelStation, station.name)
                            }
                            className="text-destructive hover:text-destructive/80"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
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
