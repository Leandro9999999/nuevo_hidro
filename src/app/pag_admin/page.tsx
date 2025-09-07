// "use client";
// import React, { useState, useEffect } from "react";
// import { MapPin, Building2, Plus, Trash } from "lucide-react";
// import { fuelStationService } from "../../../service/fuelStationCreateSchema";
// import { FuelStationCreate, fuelStationCreateSchema } from "../../../service/fuelStationCreateSchema";

// type FuelStation = FuelStationCreate & {
//   id_fuel_station: number;
//   created_at?: string;
//   updated_at?: string;
// };

// export default function AdminPage() {
//   const [stations, setStations] = useState<FuelStation[]>([]);
//   const [formData, setFormData] = useState<FuelStationCreate>({
//     stationName: "",
//     address: "",
//     latitude: 0,
//     longitude: 0,
//     idMunicipality: 1,
//     image: undefined,
//   });
//   const [errors, setErrors] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Cargar estaciones al iniciar
//   useEffect(() => {
//     const fetchStations = async () => {
//       setLoading(true);
//       try {
//         const data = await fuelStationService.findAll();
//         setStations(data);
//       } catch (err: any) {
//         setErrors([err?.message || "No se pudieron cargar las estaciones"]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStations();
//   }, []);

//   // Crear estación
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors([]);

//     try {
//       // Validar con Zod antes de enviar
//       const validated = fuelStationCreateSchema.parse(formData);

//       // Llamar al servicio
//       const newStation = await fuelStationService.create(validated);
//       setStations((prev) => [newStation, ...prev]);

//       // Reset form
//       setFormData({
    
//         address: "",
//         latitude: 0,
//         longitude: 0,
//         idMunicipality: 1,
//         image: undefined,
//       });
//     } catch (error: any) {
//       console.error("Error al crear estación:", error);
//       if (Array.isArray(error)) {
//         setErrors(error.map((err) => err.message));
//       } else if (error?.message) {
//         setErrors([error.message]);
//       } else {
//         setErrors(["No se pudo crear la estación"]);
//       }
//     }
//   };

//   // Actualizar inputs
//   const handleInputChange = (
//     field: keyof FuelStationCreate,
//     value: string | number | undefined
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Eliminar estación
//   const handleDelete = async (id: number) => {
//     if (!confirm("¿Seguro quieres eliminar esta estación?")) return;
//     try {
//       await fuelStationService.remove(id);
//       setStations((prev) => prev.filter((s) => s.id_fuel_station !== id));
//     } catch (err: any) {
//       setErrors([err?.message || "No se pudo eliminar la estación"]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-12">
//       <main className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
//         {/* Formulario */}
//         <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
//           <div className="flex items-center gap-3 mb-4">
//             <Plus className="h-5 w-5 text-green-600" />
//             <h2 className="text-xl font-semibold text-gray-800">Crear Nueva Estación</h2>
//           </div>

//           {errors.length > 0 && (
//             <div className="bg-red-50 text-red-700 p-3 rounded-md">
//               <ul className="list-disc list-inside">
//                 {errors.map((err, i) => <li key={i}>{err}</li>)}
//               </ul>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               placeholder="Nombre de la estación"
//               value={formData.stationName}
//               onChange={(e) => handleInputChange("stationName", e.target.value)}
//               className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//               required
//             />
//             <input
//               placeholder="ID Municipio"
//               type="number"
//               value={formData.idMunicipality}
//               onChange={(e) => handleInputChange("idMunicipality", parseInt(e.target.value))}
//               className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//               required
//             />
//             <input
//               placeholder="Dirección"
//               value={formData.address}
//               onChange={(e) => handleInputChange("address", e.target.value)}
//               className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//               required
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="number"
//                 placeholder="Latitud"
//                 value={formData.latitude}
//                 onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value))}
//                 className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Longitud"
//                 value={formData.longitude}
//                 onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value))}
//                 className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//                 required
//               />
//             </div>
//             <input
//               placeholder="URL de imagen (opcional)"
//               value={formData.image || ""}
//               onChange={(e) => handleInputChange("image", e.target.value || undefined)}
//               className="p-3 border rounded-md w-full focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
//             />
//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 transition"
//             >
//               <Plus className="h-5 w-5" /> Crear Estación
//             </button>
//           </form>
//         </div>

//         {/* Listado */}
//         <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Building2 className="h-5 w-5 text-blue-600" />
//               <h2 className="text-xl font-semibold text-gray-800">Estaciones Registradas</h2>
//             </div>
//             <span className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-full">{stations.length}</span>
//           </div>

//           <div className="space-y-4 max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//             {stations.length === 0 ? (
//               <div className="text-center py-8 text-gray-400">
//                 <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p>No hay estaciones registradas</p>
//               </div>
//             ) : (
//               stations.map((station) => (
//                 <div key={station.id_fuel_station} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition">
//                   {station.image ? (
//                     <img src={station.image} alt={station.stationName} className="w-16 h-16 rounded-lg object-cover" />
//                   ) : (
//                     <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
//                       <Building2 className="h-8 w-8 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-gray-900 truncate">{station.stationName}</h3>
//                     <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
//                       <MapPin className="h-3 w-3" />
//                       <span className="truncate">{station.address}</span>
//                     </div>
//                     <span className="mt-2 inline-block text-xs font-medium px-2 py-1 border border-gray-300 rounded-full">Municipio: {station.idMunicipality}</span>
//                   </div>
//                   <button onClick={() => handleDelete(station.id_fuel_station)} className="text-red-600 hover:text-red-800 p-1 rounded-md">
//                     <Trash className="h-5 w-5" />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
