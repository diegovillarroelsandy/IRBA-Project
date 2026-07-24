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
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={500}
              height={300}
              className="w-full h-56 object-contain bg-gray-50 p-4"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold">{item.name}</h2>

              <button
                onClick={() => setSelectedItem(item)}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                Ver modelo
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
