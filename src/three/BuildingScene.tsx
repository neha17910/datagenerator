import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore, BuildingConfig } from '../store/buildingStore';

// Wall component
function Wall({ position, size, color, wireframe }: { position: [number, number, number]; size: [number, number, number]; color: string; wireframe: boolean }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.8} />
    </mesh>
  );
}

// Floor slab
function FloorSlab({ position, size, wireframe }: { position: [number, number, number]; size: [number, number, number]; wireframe: boolean }) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8b8b8b" wireframe={wireframe} roughness={0.9} />
    </mesh>
  );
}

// Window component
function Window({ position, size, rotation }: { position: [number, number, number]; size: [number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.08]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.3} />
      </mesh>
      {/* Window glass */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[size[0] - 0.1, size[1] - 0.1, 0.04]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} roughness={0.1} metalness={0.3} />
      </mesh>
    </group>
  );
}

// Door component
function Door({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      {/* Door frame */}
      <mesh>
        <boxGeometry args={[size[0] + 0.15, size[1] + 0.1, 0.12]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.7} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0] - 0.1, size[1] - 0.1, 0.08]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.6} />
      </mesh>
      {/* Door handle */}
      <mesh position={[size[0] * 0.35, 0, 0.08]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#c0a060" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Roof component
function Roof({ width, length, height, roofType, wireframe }: { width: number; length: number; height: number; roofType: string; wireframe: boolean }) {
  if (roofType === 'flat') {
    return (
      <mesh position={[0, height + 0.1, 0]} castShadow>
        <boxGeometry args={[width + 0.5, 0.3, length + 0.5]} />
        <meshStandardMaterial color="#607080" wireframe={wireframe} roughness={0.8} />
      </mesh>
    );
  }
  
  // Gable roof
  const roofHeight = Math.min(width, length) * 0.3;
  return (
    <group position={[0, height, 0]}>
      <mesh rotation={[0, 0, 0]} castShadow>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8}
            array={new Float32Array([
              -width/2 - 0.3, 0, -length/2 - 0.3,
              width/2 + 0.3, 0, -length/2 - 0.3,
              width/2 + 0.3, 0, length/2 + 0.3,
              -width/2 - 0.3, 0, length/2 + 0.3,
              0, roofHeight, -length/2 - 0.3,
              0, roofHeight, length/2 + 0.3,
              -width/2 - 0.3, 0.1, length/2 + 0.3,
              width/2 + 0.3, 0.1, length/2 + 0.3,
            ])}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={24}
            array={new Uint16Array([
              0, 1, 4, 1, 2, 5, 2, 3, 5, 3, 0, 4,
              4, 5, 2, 4, 2, 1, 0, 3, 5, 0, 5, 4,
            ])}
            itemSize={1}
          />
        </bufferGeometry>
        <meshStandardMaterial color="#8b4513" wireframe={wireframe} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Balcony component
function Balcony({ position, size, wireframe }: { position: [number, number, number]; size: [number, number, number]; wireframe: boolean }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#a0a0a0" wireframe={wireframe} roughness={0.7} />
      </mesh>
      {/* Railing */}
      <mesh position={[0, 0.5, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.05, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.6} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.25, size[2] / 2]}>
        <boxGeometry args={[size[0], 0.05, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.6} wireframe={wireframe} />
      </mesh>
      {/* Railing posts */}
      {[-size[0]/2, 0, size[0]/2].map((x, i) => (
        <mesh key={i} position={[x, 0.25, size[2] / 2]}>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color="#333" metalness={0.6} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

// Parking area
function ParkingArea({ width, length, wireframe }: { width: number; length: number; wireframe: boolean }) {
  const parkingWidth = width * 0.6;
  const parkingLength = 5;
  return (
    <group position={[width / 2 + parkingWidth / 2 + 1, 0.01, -length / 4]}>
      {/* Parking surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[parkingWidth, parkingLength]} />
        <meshStandardMaterial color="#555555" wireframe={wireframe} roughness={0.9} />
      </mesh>
      {/* Parking lines */}
      {[-parkingWidth/4, 0, parkingWidth/4].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, parkingLength]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

// Garden/Trees
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 2.4, 0.3]} castShadow>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#3a7a33" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Garden({ width, length }: { width: number; length: number }) {
  const treePositions: [number, number, number][] = [
    [-width / 2 - 2, 0, -length / 4],
    [-width / 2 - 3, 0, length / 4],
    [width / 2 + 2, 0, length / 3],
    [-width / 2 - 2.5, 0, 0],
    [width / 2 + 3, 0, -length / 3],
  ];

  return (
    <group>
      {/* Grass area */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width + 10, length + 10]} />
        <meshStandardMaterial color="#4a8c3f" roughness={0.9} />
      </mesh>
      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </group>
  );
}

// Main Building component
function Building({ config, wireframe }: { config: BuildingConfig; wireframe: boolean }) {
  const { dimensions, floors, features, style } = config;
  const { width, length, floorHeight } = dimensions;
  const totalHeight = floors * floorHeight;
  const wallThickness = 0.2;

  return (
    <group>
      {/* Foundation */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[width + 0.4, 0.3, length + 0.4]} />
        <meshStandardMaterial color="#666666" wireframe={wireframe} roughness={0.9} />
      </mesh>

      {/* Floor slabs and walls for each floor */}
      {Array.from({ length: floors }, (_, i) => {
        const y = i * floorHeight;
        return (
          <group key={i}>
            {/* Floor slab */}
            <FloorSlab
              position={[0, y, 0]}
              size={[width, 0.2, length]}
              wireframe={wireframe}
            />
            
            {/* Front wall */}
            <Wall
              position={[0, y + floorHeight / 2, length / 2]}
              size={[width, floorHeight, wallThickness]}
              color={style.wallColor}
              wireframe={wireframe}
            />
            {/* Back wall */}
            <Wall
              position={[0, y + floorHeight / 2, -length / 2]}
              size={[width, floorHeight, wallThickness]}
              color={style.wallColor}
              wireframe={wireframe}
            />
            {/* Left wall */}
            <Wall
              position={[-width / 2, y + floorHeight / 2, 0]}
              size={[wallThickness, floorHeight, length]}
              color={style.wallColor}
              wireframe={wireframe}
            />
            {/* Right wall */}
            <Wall
              position={[width / 2, y + floorHeight / 2, 0]}
              size={[wallThickness, floorHeight, length]}
              color={style.wallColor}
              wireframe={wireframe}
            />

            {/* Windows */}
            {Array.from({ length: config.windows.perFloor }, (_, wi) => {
              const spacing = width / (config.windows.perFloor + 1);
              const x = -width / 2 + spacing * (wi + 1);
              const windowSize: [number, number] = config.windows.size === 'large' ? [1.8, 2.0] : config.windows.size === 'medium' ? [1.2, 1.5] : [0.8, 1.0];
              return (
                <React.Fragment key={`w-${i}-${wi}`}>
                  {/* Front windows */}
                  <Window
                    position={[x, y + floorHeight * 0.55, length / 2 + 0.1]}
                    size={windowSize}
                    rotation={[0, 0, 0]}
                  />
                  {/* Back windows */}
                  <Window
                    position={[x, y + floorHeight * 0.55, -length / 2 - 0.1]}
                    size={windowSize}
                    rotation={[0, Math.PI, 0]}
                  />
                </React.Fragment>
              );
            })}

            {/* Side windows */}
            {Array.from({ length: Math.max(2, Math.floor(config.windows.perFloor * length / width / 2)) }, (_, wi) => {
              const spacing = length / (Math.floor(config.windows.perFloor * length / width / 2) + 1);
              const z = -length / 2 + spacing * (wi + 1);
              const windowSize: [number, number] = config.windows.size === 'large' ? [1.8, 2.0] : config.windows.size === 'medium' ? [1.2, 1.5] : [0.8, 1.0];
              return (
                <React.Fragment key={`sw-${i}-${wi}`}>
                  <Window
                    position={[width / 2 + 0.1, y + floorHeight * 0.55, z]}
                    size={windowSize}
                    rotation={[0, Math.PI / 2, 0]}
                  />
                  <Window
                    position={[-width / 2 - 0.1, y + floorHeight * 0.55, z]}
                    size={windowSize}
                    rotation={[0, -Math.PI / 2, 0]}
                  />
                </React.Fragment>
              );
            })}

            {/* Main door on ground floor */}
            {i === 0 && (
              <Door
                position={[0, floorHeight * 0.4, length / 2 + 0.1]}
                size={[1.4, 2.4]}
              />
            )}

            {/* Balconies */}
            {features.balcony && i > 0 && (
              <>
                <Balcony
                  position={[-width / 4, y + 0.1, length / 2 + 0.8]}
                  size={[2.5, 0.15, 1.5]}
                  wireframe={wireframe}
                />
                <Balcony
                  position={[width / 4, y + 0.1, length / 2 + 0.8]}
                  size={[2.5, 0.15, 1.5]}
                  wireframe={wireframe}
                />
              </>
            )}
          </group>
        );
      })}

      {/* Top floor slab / ceiling */}
      <FloorSlab
        position={[0, totalHeight, 0]}
        size={[width, 0.2, length]}
        wireframe={wireframe}
      />

      {/* Roof */}
      <Roof
        width={width}
        length={length}
        height={totalHeight}
        roofType={style.roofType}
        wireframe={wireframe}
      />

      {/* Parking */}
      {features.parking && <ParkingArea width={width} length={length} wireframe={wireframe} />}

      {/* Garden */}
      {features.garden && <Garden width={width} length={length} />}

      {/* Rooftop garden */}
      {features.rooftop && (
        <group position={[0, totalHeight + 0.3, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[width * 0.6, 0.1, length * 0.6]} />
            <meshStandardMaterial color="#4a8c3f" roughness={0.9} />
          </mesh>
          {/* Small plants on rooftop */}
          {[-2, 0, 2].map((x, i) => (
            <mesh key={i} position={[x, 0.3, 0]} castShadow>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#2d5a27" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// Rotating platform
function RotatingPlatform({ children, autoRotate }: { children: React.ReactNode; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Loading indicator
function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-sm font-medium">Generating Building...</p>
      </div>
    </Html>
  );
}

// Main Scene component
export default function BuildingScene() {
  const { currentConfig, wireframeMode, dayMode, showGrid, showAxes, isGenerating } = useBuildingStore();

  const ambientIntensity = dayMode ? 0.6 : 0.15;
  const directionalIntensity = dayMode ? 1.2 : 0.3;
  const bgColor = dayMode ? '#87ceeb' : '#1a1a2e';

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [25, 20, 25], fov: 50 }}
        style={{ background: bgColor }}
      >
        {/* Lighting */}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={directionalIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        {!dayMode && (
          <>
            <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffd700" />
            <pointLight position={[0, 5, currentConfig.dimensions.length / 2 + 1]} intensity={0.8} color="#ffaa00" />
          </>
        )}

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color={dayMode ? '#90a87f' : '#1a2a1a'} roughness={1} />
        </mesh>

        {/* Grid helper */}
        {showGrid && (
          <Grid
            args={[100, 100]}
            position={[0, 0.02, 0]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#666666"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#999999"
            fadeDistance={50}
            fadeStrength={1}
          />
        )}

        {/* Axes helper */}
        {showAxes && (
          <group>
            <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xff0000]} />
            <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 5, 0x00ff00]} />
            <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5, 0x0000ff]} />
          </group>
        )}

        {/* Building */}
        {isGenerating ? (
          <LoadingIndicator />
        ) : (
          <Building config={currentConfig} wireframe={wireframeMode} />
        )}

        {/* Contact shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={50}
          blur={2}
          far={20}
        />

        {/* Controls */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}
