import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const FramedWindow = ({
  position,
  size = [0.72, 0.72, 0.07],
  glow = "#ffd6a0",
  trim = "#eee7dc",
}) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[size[0] + 0.18, size[1] + 0.18, 0.1]} />
      <meshStandardMaterial color={trim} roughness={0.72} />
    </mesh>
    <mesh position={[0, 0, 0.065]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={glow}
        emissive="#d98242"
        emissiveIntensity={1.45}
        roughness={0.34}
      />
    </mesh>
    <mesh position={[0, 0, 0.108]}>
      <boxGeometry args={[0.045, size[1] - 0.03, 0.018]} />
      <meshStandardMaterial color={trim} roughness={0.66} />
    </mesh>
    <mesh position={[0, 0, 0.108]}>
      <boxGeometry args={[size[0] - 0.03, 0.045, 0.018]} />
      <meshStandardMaterial color={trim} roughness={0.66} />
    </mesh>
  </group>
);

const RoofPlane = ({ position, rotationZ, size, color, materialRef }) => (
  <mesh castShadow receiveShadow position={position} rotation={[0, 0, rotationZ]}>
    <boxGeometry args={size} />
    <meshStandardMaterial
      ref={materialRef}
      color={color}
      roughness={0.72}
      metalness={0.04}
      transparent
    />
  </mesh>
);

const StylizedHouse = ({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  wallColor = "#c7b79f",
  roofColor = "#30353a",
  trimColor = "#eee7dc",
  hovered = false,
  onHover = () => {},
  reducedMotion = false,
  interactive = true,
  float = true,
  showAura = true,
  missionHouse = false,
  worldState = null,
}) => {
  const house = useRef();
  const wallMaterial = useRef();
  const roofMaterial = useRef();
  const statusMaterial = useRef();
  const porchLight = useRef();
  const baseY = position[1] || 0;

  useFrame(({ clock }, delta) => {
    if (!house.current) return;

    const targetScale = scale * (hovered ? 1.025 : 1);
    const nextScale = reducedMotion
      ? targetScale
      : THREE.MathUtils.damp(house.current.scale.x, targetScale, 5, delta);
    house.current.scale.setScalar(nextScale);

    if (float) {
      house.current.position.y = reducedMotion
        ? baseY
        : baseY + Math.sin(clock.elapsedTime * 0.58) * 0.018;
    }

    if (wallMaterial.current) {
      wallMaterial.current.emissiveIntensity = hovered ? 0.055 : 0.012;
    }
    if (roofMaterial.current) {
      roofMaterial.current.emissiveIntensity = hovered ? 0.035 : 0.005;
    }
    if (porchLight.current) {
      porchLight.current.intensity = reducedMotion
        ? 1.45
        : 1.35 + Math.sin(clock.elapsedTime * 1.15) * 0.08;
    }

    if (missionHouse && statusMaterial.current && worldState?.current) {
      const step = worldState.current.currentStep;
      const resolved = step > 10.25;
      const active = step > 0.72 && !resolved;
      statusMaterial.current.color.set(resolved ? "#d7f4df" : active ? "#ffd5a0" : "#7a817b");
      statusMaterial.current.emissive.set(resolved ? "#3ca66f" : active ? "#c96f34" : "#121a14");
      statusMaterial.current.emissiveIntensity = resolved ? 2.3 : active ? 1.7 : 0.2;
    }
  });

  return (
    <group
      ref={house}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerEnter={interactive ? (event) => {
        event.stopPropagation();
        onHover(true);
      } : undefined}
      onPointerLeave={interactive ? () => onHover(false) : undefined}
    >
      {/* foundation / landscaped plinth */}
      <mesh receiveShadow position={[0.25, 0.12, 0]}>
        <boxGeometry args={[5.55, 0.24, 4.42]} />
        <meshStandardMaterial color="#8c8174" roughness={0.95} />
      </mesh>

      {/* first floor */}
      <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[5.08, 2.3, 4.02]} />
        <meshStandardMaterial
          ref={wallMaterial}
          color={wallColor}
          emissive="#5d4535"
          emissiveIntensity={0.012}
          roughness={0.78}
          metalness={0.015}
        />
      </mesh>

      {/* second floor, slightly recessed like a polished JSM-style miniature */}
      <mesh castShadow receiveShadow position={[-0.35, 3.0, -0.1]}>
        <boxGeometry args={[4.36, 1.62, 3.58]} />
        <meshStandardMaterial color={wallColor} roughness={0.76} />
      </mesh>

      {/* fascia line */}
      <mesh castShadow position={[-0.35, 2.23, 1.93]}>
        <boxGeometry args={[4.52, 0.15, 0.12]} />
        <meshStandardMaterial color={trimColor} roughness={0.68} />
      </mesh>

      {/* true pitched roof made from two planes instead of a generic cone */}
      <RoofPlane
        position={[-1.48, 4.08, -0.1]}
        rotationZ={-0.55}
        size={[3.05, 0.2, 4.25]}
        color={roofColor}
        materialRef={roofMaterial}
      />
      <RoofPlane
        position={[0.78, 4.08, -0.1]}
        rotationZ={0.55}
        size={[3.05, 0.2, 4.25]}
        color={roofColor}
      />

      {/* chimney */}
      <mesh castShadow position={[-1.78, 4.18, -0.86]}>
        <boxGeometry args={[0.56, 1.65, 0.66]} />
        <meshStandardMaterial color="#73584a" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[-1.78, 5.0, -0.86]}>
        <boxGeometry args={[0.7, 0.16, 0.8]} />
        <meshStandardMaterial color="#4c3b33" roughness={0.82} />
      </mesh>

      {/* garage wing */}
      <mesh castShadow receiveShadow position={[3.18, 0.98, 0.15]}>
        <boxGeometry args={[2.02, 1.78, 3.38]} />
        <meshStandardMaterial color="#b8aa96" roughness={0.8} />
      </mesh>
      <RoofPlane position={[2.7, 2.17, 0.15]} rotationZ={-0.5} size={[1.45, 0.16, 3.7]} color={roofColor} />
      <RoofPlane position={[3.78, 2.17, 0.15]} rotationZ={0.5} size={[1.45, 0.16, 3.7]} color={roofColor} />
      <mesh position={[3.18, 0.86, 1.87]}>
        <boxGeometry args={[1.58, 1.18, 0.1]} />
        <meshStandardMaterial color="#80786f" metalness={0.08} roughness={0.7} />
      </mesh>
      {[0.48, 0.08, -0.32].map((y) => (
        <mesh key={y} position={[3.18, 0.86 + y, 1.935]}>
          <boxGeometry args={[1.38, 0.035, 0.015]} />
          <meshStandardMaterial color="#b7afa5" roughness={0.7} />
        </mesh>
      ))}

      {/* porch */}
      <mesh receiveShadow position={[0.52, 0.16, 2.48]}>
        <boxGeometry args={[2.7, 0.18, 1.42]} />
        <meshStandardMaterial color="#a49b8d" roughness={0.94} />
      </mesh>
      <mesh castShadow position={[0.52, 2.12, 2.35]}>
        <boxGeometry args={[2.82, 0.18, 1.52]} />
        <meshStandardMaterial color={roofColor} roughness={0.76} />
      </mesh>
      {[-0.52, 1.56].map((x) => (
        <mesh key={x} castShadow position={[x, 1.08, 2.56]}>
          <boxGeometry args={[0.14, 1.88, 0.14]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
      ))}

      {/* front door */}
      <mesh castShadow position={[0.52, 1.08, 2.055]}>
        <boxGeometry args={[0.88, 1.78, 0.11]} />
        <meshStandardMaterial color="#56382d" roughness={0.72} />
      </mesh>
      <mesh position={[0.52, 1.42, 2.12]}>
        <boxGeometry args={[0.52, 0.52, 0.025]} />
        <meshStandardMaterial color="#7b513d" roughness={0.7} />
      </mesh>
      <mesh position={[0.84, 1.02, 2.13]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#d3b16d" metalness={0.62} roughness={0.34} />
      </mesh>

      {/* warm windows positioned so VoiceOps still originates from the Unit 204 window */}
      <FramedWindow position={[-1.28, 2.62, 2.02]} trim={trimColor} />
      <FramedWindow position={[0.34, 2.62, 2.02]} trim={trimColor} />
      <FramedWindow position={[-1.55, 1.18, 2.07]} size={[0.84, 0.76, 0.07]} trim={trimColor} />
      <FramedWindow position={[1.55, 1.18, 2.07]} size={[0.78, 0.76, 0.07]} trim={trimColor} />

      {/* front steps */}
      <mesh receiveShadow position={[0.52, 0.08, 3.02]}>
        <boxGeometry args={[1.48, 0.16, 0.42]} />
        <meshStandardMaterial color="#9d968a" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0.52, 0.03, 3.36]}>
        <boxGeometry args={[1.72, 0.1, 0.34]} />
        <meshStandardMaterial color="#8e887f" roughness={0.96} />
      </mesh>

      {/* understated landscaping */}
      {[-2.25, 2.05].map((x) => (
        <group key={x} position={[x, 0.42, 2.25]}>
          <mesh castShadow scale={[1.15, 0.75, 0.85]}>
            <sphereGeometry args={[0.42, 12, 8]} />
            <meshStandardMaterial color="#334b39" roughness={0.96} />
          </mesh>
        </group>
      ))}

      {/* porch light */}
      <mesh position={[-0.08, 1.66, 2.14]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#ffe4b2" emissive="#ffac54" emissiveIntensity={2.1} />
      </mesh>
      <pointLight ref={porchLight} position={[-0.08, 1.66, 2.55]} color="#ffbb6a" intensity={1.45} distance={3.8} decay={2} />

      {showAura && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.25, 0.015, 0]}>
          <ringGeometry args={[3.45, 3.5, 72]} />
          <meshBasicMaterial color={hovered ? "#78f4ff" : "#315e67"} transparent opacity={hovered ? 0.75 : 0.22} />
        </mesh>
      )}

      {missionHouse && (
        <group position={[-2.05, 0.62, 2.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.58, 0.09]} />
            <meshStandardMaterial color="#3a403c" roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.04, 0.052]}>
            <boxGeometry args={[0.2, 0.09, 0.025]} />
            <meshStandardMaterial ref={statusMaterial} color="#7a817b" emissive="#121a14" emissiveIntensity={0.2} />
          </mesh>
          <Html center position={[0, -0.56, 0]} distanceFactor={10}>
            <span className="world-address-tag">UNIT 204</span>
          </Html>
        </group>
      )}
    </group>
  );
};

export default StylizedHouse;
