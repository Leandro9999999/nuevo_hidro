"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import AdminPage from "@/app/pag_admin/page";
export default function Navbar() {
  const pathname = usePathname();

  const isAuthPage = pathname === "/auth"; // Nueva ruta para login+registro

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="text-yellow-500">P</span>
          <span className="text-yellow-500">e</span>
          <span className="text-yellow-500">t</span>
          <span className="text-yellow-500">r</span>
          <span className="text-yellow-500">o</span>
          <span className="text-red-600">B</span>
          <span className="text-yellow-400">O</span>
          <span className="text-green-600">L</span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-red-500 transition">Inicio</Link>
            <Link href="/stations" className="hover:text-red-500 transition">Estaciones Servicios</Link>
            <Link href="/about" className="hover:text-red-500 transition">¿Quiénes somos?</Link>
            {/* <Link href="/pag_admin" className="hover:text-red-500 transition">AdminPage</Link> */}
            {/* <Link href="/User_Client" className="hover:text-red-500 transition">cliente</Link> */}
          </div>

          {/* Botón para login/registro */}
          {!isAuthPage && (
            <Link href="/auth">
              <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition text-white font-semibold">
                Ingresar
              </button>
            </Link>
          )}

         
        </div>
      </div>
    </nav>
  );
}
