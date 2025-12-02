import { Suspense, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Html } from "@react-three/drei";
import { TextureLoader } from "three";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600959907703-125ba1374a12?auto=format&fit=crop&w=800&q=80"
];

interface MedicalSceneProps {
  images?: string[];
  ambientIntensity?: number;
  glowColor?: string;
  className?: string;
  disableControls?: boolean;
}

interface BillboardProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

function Billboard({ url, position, rotation = [0, 0, 0], scale = 1 }: BillboardProps) {
  const texture = useLoader(TextureLoader, url);

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[1.5 * scale, 2 * scale, 32, 32]} />
        <meshBasicMaterial map={texture} transparent opacity={0.9} />
      </mesh>
    </Float>
  );
}

function GlowingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={3} floatIntensity={0.8} rotationIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} />
      </mesh>
    </Float>
  );
}

function DNAHelix({ turns = 6, radius = 0.5, height = 3 }) {
  const points = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    const steps = 60;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2 * turns;
      const y = (i / steps - 0.5) * height;
      pts.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
    }
    return pts;
  }, [turns, radius, height]);

  return (
    <Float speed={1.2} floatIntensity={0.5}>
      <group>
        {points.map(([x, y, z], idx) => (
          <mesh key={`helix-${idx}`} position={[x, y, z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#6366f1" : "#22d3ee"} emissive="#6366f1" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function MedicalScene({
  images = DEFAULT_IMAGES,
  ambientIntensity = 0.8,
  glowColor = "#6366f1",
  className,
  disableControls = true,
}: MedicalSceneProps) {
  const billboardImages = useMemo(() => {
    if (!images.length) return DEFAULT_IMAGES;
    return images;
  }, [images]);

  return (
    <div className={className}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={ambientIntensity} />
        <pointLight position={[4, 6, 6]} intensity={1.5} color={glowColor} />
        <pointLight position={[-4, -6, -6]} intensity={1} color="#0ea5e9" />

        <Suspense fallback={<Html center className="text-white text-sm">Loading visual...</Html>}>
          <Stars radius={10} depth={20} count={500} factor={4} fade speed={1} />

          <group>
            <Billboard url={billboardImages[0]} position={[-1.8, 0.6, 0]} rotation={[0, 0.2, 0.1]} />
            <Billboard url={billboardImages[1 % billboardImages.length]} position={[1.8, 0.3, -0.5]} rotation={[0, -0.3, 0]} scale={0.9} />
            <Billboard url={billboardImages[2 % billboardImages.length]} position={[0.2, -1, 0.6]} rotation={[0.1, 0.4, 0]} scale={1.1} />

            <GlowingSphere position={[0, 1.8, -1]} color={glowColor} />
            <GlowingSphere position={[-2, -1.4, -0.5]} color="#22d3ee" />
            <GlowingSphere position={[2.4, 1.2, 0.8]} color="#14b8a6" />

            <DNAHelix />
          </group>
        </Suspense>

        {!disableControls && <OrbitControls enableZoom={false} />}
      </Canvas>
    </div>
  );
}
