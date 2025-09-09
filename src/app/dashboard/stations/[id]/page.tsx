// src/app/dashboard/stations/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { stationsAPI } from "../../../../../service/stationsService";
import { FuelStation } from "../../../../../types";
import { toast } from "react-toastify";

export default function StationDetailPage() {
  const [station, setStation] = useState<FuelStation | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchStation = async () => {
      const id = params.id;
      if (typeof id !== "string") {
        router.push("/dashboard/stations"); // Redirige si el ID no es válido
        return;
      }
      try {
        const data = await stationsAPI.getById(Number(id));
        setStation(data);
      } catch (err) {
        toast.error("Error al cargar la estación.");
        router.push("/dashboard/stations"); // Redirige si la estación no se encuentra
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [params.id, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          Cargando estación...
        </div>
      </DashboardLayout>
    );
  }

  if (!station) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">Estación no encontrada</h1>
          <p className="text-gray-500 mt-2">
            La estación que buscas no existe o ha sido eliminada.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-accent hover:underline"
          >
            Volver
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{station.name}</h1>
        <p className="text-muted-foreground">{station.municipality}</p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Detalles de la Estación
          </h2>

          <div className="flex items-center gap-2 text-foreground">
            <p className="font-medium">Dirección:</p>
            <p>{station.address}</p>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <p className="font-medium">Coordenadas GPS:</p>
            <p>
              Latitud: {station.gpsLatitude}, Longitud: {station.gpsLongitude}
            </p>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Volver
            </button>
            <button
              onClick={() =>
                router.push(`/dashboard/stations/${station.idFuelStation}/edit`)
              }
              className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
