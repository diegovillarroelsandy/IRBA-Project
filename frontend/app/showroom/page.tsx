"use client";

import Image from "next/image";
import { useState } from "react";
import { showroomItems } from "@/lib/showroom";
import ModelViewer from "@/components/showroom/ModelViewer";

export default function ShowroomPage() {
  const [selectedItem, setSelectedItem] = useState<
    (typeof showroomItems)[0] | null
  >(null);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">Showroom 3D</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {showroomItems.map((item) => (
          <div
            key={item.id}
            className="
    group
    overflow-hidden
    rounded-3xl
    bg-white
    border border-gray-200
    shadow-sm
    hover:shadow-2xl
    hover:border-gray-300
    transition-all
    duration-500
    hover:-translate-y-2
  "
          >
            {/* Imagen */}
            <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="
        object-contain
        p-8
        transition-transform
        duration-500
        group-hover:scale-110
      "
              />

              {/* Badge */}
              <span className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                Nuevo
              </span>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>

              <p className="mt-2 text-gray-500 line-clamp-2">
                {item.description}
              </p>

              {/* Características */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  3D
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  Alta calidad
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  Interactivo
                </span>
              </div>

              {/* Botón */}
              <button
                onClick={() => setSelectedItem(item)}
                className="
        mt-6
        w-full
        rounded-xl
        bg-black
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-gray-800
        hover:scale-[1.02]
        active:scale-95
      "
              >
                Explorar en 3D →
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-[95vw] max-w-7xl h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>

                <p className="text-gray-500">{selectedItem.description}</p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Viewer */}

            <div className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300">
              <ModelViewer model={selectedItem?.model} />
            </div>

            {/* Footer */}

            <div className="border-t px-6 py-3 flex justify-between text-gray-600 text-sm">
              <span>🖱 Arrastra para rotar</span>

              <span>🔍 Usa la rueda para acercar</span>

              <span>↺ Doble clic para centrar</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
