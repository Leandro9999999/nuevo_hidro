"use client";

import { Fuel, Droplet, Flame, Store } from 'lucide-react';
import Footer from '@/components/footer';


const estaciones = [
  {
    nombre: "Estación Central",
    direccion: "Av. América #123, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Diésel Oíl", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
  {
    nombre: "Servicio Express",
    direccion: "Calle Ayacucho #456, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Premium", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Diésel ULSD/ULS", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
    ],
  },
  {
    nombre: "FullCarga",
    direccion: "Av. Circunvalación #789, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
  {
    nombre: "Estación Sur",
    direccion: "Zona Sud #101, Cochabamba",
    combustibles: [
      { tipo: "Diésel Oíl", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
  {
    nombre: "EcoFuel",
    direccion: "Av. Blanco Galindo Km 7, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
    ],
  },
  {
    nombre: "RutaGas",
    direccion: "Carretera Sacaba, Km 4, Cochabamba",
    combustibles: [
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
  {
    nombre: "AutoStop",
    direccion: "Av. Beijing #400, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Premium", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Diésel ULSD/ULS", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
    ],
  },
  {
    nombre: "Combustibles del Valle",
    direccion: "Zona Tamborada, Calle D #55, Cochabamba",
    combustibles: [
      { tipo: "Diésel Oíl", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
    ],
  },
  {
    nombre: "CargaExpress",
    direccion: "Av. Villazón #300, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Gasolina Premium", icono: <Fuel className="w-5 h-5 text-red-600" /> },
    ],
  },
  {
    nombre: "PetroCarga",
    direccion: "Av. Blanco Galindo Km 10, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Diésel ULSD/ULS", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
    ],
  },
  {
    nombre: "RapidFuel",
    direccion: "Calle Litoral #100, Cochabamba",
    combustibles: [
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
    ],
  },
  {
    nombre: "Estación Norte",
    direccion: "Zona Norte, Av. Tadeo Haenke #99, Cochabamba",
    combustibles: [
      { tipo: "Diésel Oíl", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
  {
    nombre: "CentroFuel",
    direccion: "Calle Colombia #321, Centro, Cochabamba",
    combustibles: [
      { tipo: "Gasolina Especial", icono: <Fuel className="w-5 h-5 text-red-600" /> },
      { tipo: "Diésel Oíl", icono: <Droplet className="w-5 h-5 text-yellow-600" /> },
      { tipo: "Gas Natural Vehicular", icono: <Flame className="w-5 h-5 text-blue-600" /> },
    ],
  },
];
export default function stations() {
  return (
    <>
      <section className="bg-white text-black pt-32 pb-16 px-6 md:px-16">
        <h2 className="text-6xl font-extrabold text-center mb-12 relative">
          <span className="relative z-10 text-red-500">Servicios</span>
          <span className="absolute left-1/2 -bottom-2 w-32 h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 transform -translate-x-1/2 rounded-full opacity-80" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Gasolina */}
          <div className="border border-gray-200 p-8 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center mb-6 bg-red-50 rounded-xl py-4">
              <Fuel className="w-12 h-12 text-red-600 mb-2" />
              <h3 className="text-2xl font-semibold text-red-700">Gasolina</h3>
            </div>
            <div className="space-y-4 text-lg font-medium">
              <div className="flex justify-between">
                <span>Gasolina Especial</span>
                <span className="text-green-700 font-semibold">Bs. 3.74</span>
              </div>
              <div className="flex justify-between">
                <span>Gasolina Premium</span>
                <span className="text-green-700 font-semibold">Bs. 6.08</span>
              </div>
            </div>
          </div>

          {/* Diésel */}
          <div className="border border-gray-200 p-8 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center mb-6 bg-yellow-50 rounded-xl py-4">
              <Droplet className="w-12 h-12 text-yellow-700 mb-2" />
              <h3 className="text-2xl font-semibold text-yellow-800">Diésel</h3>
            </div>
            <div className="space-y-4 text-lg font-medium">
              <div className="flex justify-between">
                <span>Diésel Oíl</span>
                <span className="text-green-700 font-semibold">Bs. 3.72</span>
              </div>
              <div className="flex justify-between">
                <span>Diésel ULSD/ULS</span>
                <span className="text-green-700 font-semibold">Bs. 6.84</span>
              </div>
            </div>
          </div>

          {/* Gas */}
          <div className="border border-gray-200 p-8 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center mb-6 bg-blue-50 rounded-xl py-4">
              <Flame className="w-12 h-12 text-blue-600 mb-2" />
              <h3 className="text-2xl font-semibold text-blue-700">Gas Natural Vehicular</h3>
            </div>
            <div className="space-y-4 text-lg font-medium">
              <div className="flex justify-between">
                <span>Gas</span>
                <span className="text-green-700 font-semibold">Bs. 3.50/m³</span>
              </div>
            </div>
          </div>

          {/* Tienda */}
          <div className="border border-gray-200 p-8 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center mb-6 bg-purple-50 rounded-xl py-4">
              <Store className="w-12 h-12 text-purple-700 mb-2" />
              <h3 className="text-2xl font-semibold text-purple-700">Tienda</h3>
            </div>
            <p className="text-start text-lg font-medium">
              Bebidas, snacks y accesorios<br />
              Horario: Lun a Dom de 7:00 a 21:00
            </p>
          </div>
        </div>
              {/* Descripción final */}
        <div className="relative mt-16 max-w-5xl mx-auto px-6 text-center">
          <div className="relative z-10 py-20">
            <h4 className="text-5xl font-extrabold mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              ¿Buscas dónde cargar combustible sin perder tiempo?
            </h4>
            <p className="text-lg max-w-3xl font-bold mx-auto text-black leading-relaxed">
              En PetroBOL, te ayudamos a localizar en tiempo real la estación de servicio más cercana con disponibilidad de gasolina, diésel o gas natural.
              Planifica tu ruta y ahorra tiempo, dinero y energía.
            </p>
          </div>
        </div>

        {/* Estaciones de servicio con estilos mejorados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {estaciones.map((estacion, index) => (
            <div
              key={index}
              className="border border-gray-200 p-6 rounded-3xl shadow-md transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r from-gray-100 to-gray-200 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-red-700">{estacion.nombre}</h3>
              <p className="text-gray-600">{estacion.direccion}</p>
              <ul className="mt-4 text-lg font-medium space-y-2">
                {estacion.combustibles.map((combustible, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 border-b border-dashed border-gray-300 pb-2"
                  >
                    {combustible.icono}
                    <span className="text-green-700 font-semibold">{combustible.tipo}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

