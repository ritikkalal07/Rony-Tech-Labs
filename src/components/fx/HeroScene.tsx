import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft, light-theme aurora shader — gentle blue→teal gradients on near-white bg
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorBg;

  vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,-0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x>x0.y)? vec2(1.0,0.0): vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    vec2 mouse = (uMouse - 0.5);
    mouse.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.06;
    float n = 0.0;
    n += snoise(p * 1.4 + vec2(t, t * 0.7) + mouse * 0.5) * 0.55;
    n += snoise(p * 3.0 - vec2(t * 0.9, t)) * 0.30;
    n += snoise(p * 6.0 + vec2(t * 1.2, -t * 0.4)) * 0.15;

    float dist = length(p - mouse * 0.3);
    float ripple = smoothstep(0.8, 0.0, dist) * 0.25;
    n += ripple * sin(uTime * 1.0 - dist * 7.0);

    float bands = smoothstep(0.0, 1.0, n * 0.5 + 0.5);

    // Soft mix on near-white background
    vec3 col = uColorBg;
    col = mix(col, uColorA, smoothstep(0.45, 0.85, bands) * 0.55);
    col = mix(col, uColorB, smoothstep(0.65, 0.98, bands) * 0.45);

    // Top-down vignette to fade into the page
    float vfade = smoothstep(1.1, 0.1, length(p));
    col = mix(uColorBg, col, vfade);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: new THREE.Color("#3B82F6") },
      uColorB: { value: new THREE.Color("#2EC4B6") },
      uColorBg: { value: new THREE.Color("#F8FAFC") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    const tx = (state.pointer.x + 1) * 0.5;
    const ty = (state.pointer.y + 1) * 0.5;
    mouse.current.lerp(new THREE.Vector2(tx, ty), 0.06);
    mat.current.uniforms.uMouse.value.copy(mouse.current);
    mat.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

function Orb() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 0.7) * 0.04;
    mesh.current.scale.set(s, s, s);
    mesh.current.position.x = state.pointer.x * 0.25;
    mesh.current.position.y = state.pointer.y * 0.18;
  });

  return (
    <group>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[3, 3, 3]} intensity={1.6} color="#3B82F6" />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#2EC4B6" />
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.05, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.4}
          roughness={0.25}
          emissive="#3B82F6"
          emissiveIntensity={0.18}
          flatShading
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.4], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ShaderPlane />
          <group position={[0, 0, 1]}>
            <Orb />
          </group>
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
