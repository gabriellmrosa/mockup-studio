"use client";

import { useState, ChangeEvent, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Smartphone } from "./components/Smartphone";
import { Bounds, Center } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white relative">
      {/* BOTÃO UPLOAD */}
      <label className="absolute top-6 right-6 z-20 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg cursor-pointer transition">
        Upload imagem
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* AREA 3D FULL */}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 3, 4]} intensity={2} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Center>
                <Smartphone
                  imageUrl={uploadedImage ?? "/placeholder.jpg"}
                  scale={0.009}
                  rotation={[0, Math.PI, 0]}
                />
              </Center>
            </Bounds>
          </Suspense>

          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </main>
  );
}
