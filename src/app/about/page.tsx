// app/about/page.tsx
import Footer from "@/components/footer";
import Image from "next/image";

export default function About() {
  return (
    <>
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
        {/* Sección principal */}
        <section className="max-w-5xl text-center mb-16">
          <h1 className="text-5xl font-extrabold text-red-600 mb-8">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-800 mb-10">
            <strong>PetroBol</strong> nació con la idea de ayudar a los
            bolivianos a conocer en tiempo real qué estaciones de servicio
            cuentan con combustible disponible. Nuestra meta es brindar
            información confiable que facilite la vida de los ciudadanos.
          </p>
          <Image
            src="/estacion.png"
            alt="Estación de servicio"
            width={900}
            height={400}
            className="rounded-2xl shadow-lg mx-auto"
          />
        </section>

        {/* Misión, visión, valores */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-black text-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600">
            <h2 className="text-2xl font-semibold text-red-500 mb-3">Misión</h2>
            <p>
              Facilitar a la población boliviana el acceso rápido y confiable a
              información sobre estaciones con disponibilidad de combustible.
            </p>
          </div>
          <div className="bg-black text-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600">
            <h2 className="text-2xl font-semibold text-red-500 mb-3">Visión</h2>
            <p>
              Ser la principal plataforma tecnológica para el abastecimiento de
              combustible en Bolivia, contribuyendo al desarrollo y bienestar de
              la comunidad.
            </p>
          </div>
          <div className="bg-black text-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600">
            <h2 className="text-2xl font-semibold text-red-500 mb-3">Valores</h2>
            <p>
              Transparencia, confianza, accesibilidad, compromiso social y
              servicio a la comunidad.
            </p>
          </div>
        </div>

        {/* Equipo */}
        <section className="w-full max-w-6xl mb-20">
          <h2 className="text-3xl font-bold text-red-600 text-center mb-10">
            Nuestro Equipo
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Alex", role: "Desarrollador Backend" },
              { name: "Leandro", role: "Desarrollador Frontend" },
              { name: "Josue", role: "Especialista en Base de Datos" },
              { name: "Mauricio", role: "Diseñador UI/UX" },
              { name: "Ricardo", role: "Coordinador de Proyecto" },
              { name: "Marco", role: "Tester / QA" },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <Image
                  src={"/user.jpg"} // puedes reemplazar por una foto real
                  alt={`Foto de ${member.name}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-black">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios */}
        <section className="max-w-4xl text-center mb-20">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Servicios</h2>
          <p className="text-gray-700 text-lg">
            Brindamos información en tiempo real sobre la disponibilidad de gas,
            diésel y gasolina en estaciones de servicio en todo el país.
          </p>
          <Image
            src="/service.png"
            alt="Combustible"
            width={800}
            height={400}
            className="rounded-2xl shadow-lg mt-8 mx-auto"
          />
        </section>

        {/* Lema */}
        <section className="bg-red-600 text-white py-12 px-6 rounded-2xl shadow-lg text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Nuestro Lema</h2>
          <p className="text-xl italic">
            "Energía que te conecta, información que te mueve."
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
