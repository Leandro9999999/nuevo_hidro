"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { hasPermission } from "../../utils/permissions";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const allowedRoles = ["admin", "manager"];

  const navRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const isAuthPage = pathname === "/auth";

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/stations", label: "Estaciones Servicios" },
    { href: "/about", label: "¿Quiénes somos?" },
    ...(user && hasPermission(user, allowedRoles)
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : []),
  ];

  useEffect(() => {
    // Si estamos en /auth, ocultamos la línea
    if (isAuthPage) {
      setUnderlineStyle({ left: 0, width: 0 });
      return;
    }

    if (navRef.current) {
      const activeLink = navRef.current.querySelector<HTMLAnchorElement>(
        `a[href="${pathname}"]`
      );

      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
      } else {
        // Si no hay link activo (ruta no listada), ocultamos la línea
        setUnderlineStyle({ left: 0, width: 0 });
      }
    }
  }, [pathname, navLinks.length, isAuthPage]);

  // Mostrar la línea solo si no estamos en /auth y hay ancho > 0
  const showUnderline = !isAuthPage && underlineStyle.width > 0;

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
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
          <div ref={navRef} className="hidden md:flex space-x-8 relative">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href ? "text-accent" : "hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {showUnderline && (
              <span
                className="absolute -bottom-1 h-[2px] bg-accent transition-all duration-300"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
              />
            )}
          </div>

          {/* Botón login/logout */}
          {!isAuthPage &&
            (user ? (
              <button
                onClick={logout}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition text-white font-semibold"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link href="/auth">
                <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition text-white font-semibold">
                  Ingresar
                </button>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
