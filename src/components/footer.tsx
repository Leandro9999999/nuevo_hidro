import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-sm mt-16 p-6 text-center">

      <div className="mb-3">

        <Link href="/" className="text-2xl font-bold hover:underline">
          <span className="text-yellow-500">P</span>
          <span className="text-yellow-500">e</span>
          <span className="text-yellow-500">t</span>
          <span className="text-yellow-500">r</span>
          <span className="text-yellow-500">o</span>
          <span className="text-red-600">B</span>
          <span className="text-yellow-400">O</span>
          <span className="text-green-600">L</span>
        </Link>

      </div>

      <div className="mb-2">© 2025 RaVeN y Asociados. Todos los derechos reservados.</div>

      <div className="flex justify-center gap-4 text-xs">
        <span>📧 PetroBol@gmail.com</span>
        <span>📞 +591 70000000</span>
      </div>
      
    </footer>
  );
}
