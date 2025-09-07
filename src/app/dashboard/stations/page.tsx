"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth, hasPermission } from "@/lib/auth"
import DashboardLayout from "@/components/dashboard-layout"
import { stationsAPI } from "@/lib/api"
import { toast } from "react-toastify"
import Link from "next/link"

interface Station {
  id_fuel_station: number
  name: string
  municipality: string
  address: string
  gps_latitude: number
  gps_longitude: number
  created_at: string
}

export default function StationsManagementPage() {
  const { user } = useAuth()
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const canManageStations = hasPermission(user, ["ADMIN", "MANAGER"])

  const fetchStations = async (page = 1, searchTerm = "") => {
    setLoading(true)
    try {
      const response = await stationsAPI.getAll({
        page,
        limit: 10,
        search: searchTerm,
      })
      setStations(response.data.stations || [])
      setTotalPages(Math.ceil((response.data.total || 0) / 10))
    } catch (error) {
      toast.error("Error al cargar las estaciones")
      setStations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStations(currentPage, search)
  }, [currentPage, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchStations(1, search)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la estación "${name}"?`)) {
      return
    }

    try {
      await stationsAPI.delete(id)
      toast.success("Estación eliminada exitosamente")
      fetchStations(currentPage, search)
    } catch (error) {
      toast.error("Error al eliminar la estación")
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Estaciones</h1>
            <p className="text-muted-foreground">Administra las estaciones de combustible</p>
          </div>
          {canManageStations && (
            <Link
              href="/dashboard/stations/new"
              className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
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
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-medium hover:bg-secondary/90 transition-colors"
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
                  <td colSpan={canManageStations ? 5 : 4} className="px-6 py-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                    <p className="text-muted-foreground mt-2">Cargando estaciones...</p>
                  </td>
                </tr>
              ) : stations.length === 0 ? (
                <tr>
                  <td colSpan={canManageStations ? 5 : 4} className="px-6 py-4 text-center text-muted-foreground">
                    No se encontraron estaciones
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station.id_fuel_station} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{station.name}</div>
                        <div className="text-sm text-muted-foreground">{station.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {station.municipality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {station.gps_latitude.toFixed(4)}, {station.gps_longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(station.created_at).toLocaleDateString()}
                    </td>
                    {canManageStations && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/stations/${station.id_fuel_station}`}
                            className="text-accent hover:text-accent/80"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/dashboard/stations/${station.id_fuel_station}/edit`}
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(station.id_fuel_station, station.name)}
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
  )
}
