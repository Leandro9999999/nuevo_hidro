"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { stationsAPI } from "../../../service/stationsService";
import { usersAPI } from "../../../service/usersService";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalStations: 0,
    totalUsers: 0,
    lowStockStations: 0,
    activeStations: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stationsResponse, usersResponse] = await Promise.all([
          stationsAPI.getAll({ limit: 1 }),
          user?.role === "ADMIN"
            ? usersAPI.getAll({ limit: 1 })
            : Promise.resolve({ data: [], total: 0 }),
        ]);

        const totalStations = stationsResponse.total || 0;

        setStats({
          totalStations,
          totalUsers: usersResponse.total || 0,
          lowStockStations: Math.floor(totalStations * 0.15),
          activeStations: Math.floor(totalStations * 0.85),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {user?.name} {user?.lastName}
        </h1>
        <p className="text-muted-foreground">Resumen de tu panel de control</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Estaciones
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {loading ? "..." : stats.totalStations.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Estaciones Activas
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {loading ? "..." : stats.activeStations.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Stock Bajo
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {loading ? "..." : stats.lowStockStations.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {user?.role === "ADMIN" && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Usuarios
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {loading ? "..." : stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-card-foreground">
                  Nueva estación registrada
                </p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-card-foreground">
                  Stock bajo en Estación Central
                </p>
                <p className="text-xs text-muted-foreground">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-card-foreground">
                  Actualización de inventario
                </p>
                <p className="text-xs text-muted-foreground">Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <a
              href="/dashboard/stations"
              className="block w-full bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors text-center"
            >
              Gestionar Estaciones
            </a>
            {user?.role === "ADMIN" && (
              <>
                <a
                  href="/dashboard/users"
                  className="block w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors text-center"
                >
                  Gestionar Usuarios
                </a>
                <a
                  href="/dashboard/fuel-types"
                  className="block w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors text-center"
                >
                  Gestionar Combustibles
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
