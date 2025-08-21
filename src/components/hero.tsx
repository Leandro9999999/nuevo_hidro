"use client"

import { useEffect, useState } from "react"

const slides = [
  {
    image: "/Estacion.png",
    title: "Energía Que Mueve Tu Camino.",
  },
  {
    image: "/Estacion2.jpg",
    title: "Gasolina, Diésel y GNV en un solo lugar.",
  },
  {
    image: "/Estacion3.jpg",
    title: "Atención eficiente, incluso de noche.",
  },
  {
    image: "/Estacion4.jpg",
    title: "Planifica tu ruta con PetroBOL.",
  },
  /*{
    image: "/5.jpg",
    title: "Tu estación de confianza en cada viaje.",
  },*/
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Avanza automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const scrollToServicios = () => {
    const section = document.getElementById("servicios")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Imágenes */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black/50 absolute inset-0" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <button
              onClick={scrollToServicios}
              className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Conoce Nuestros Servicios
            </button>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
