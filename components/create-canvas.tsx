/**
 * CREATE — the WebGL stage (client-only).
 *
 * Loaded via a nested dynamic(ssr:false) from create-cinematic so the hero
 * copy + stage text stay server-rendered (SEO) while only the canvas mounts on
 * the client. Everything reads a single scrubbed `progressRef` (0…1) that the
 * parent drives off scroll:
 *
 *   0.00  hero        calm, wide particle drift
 *   0.20  inspire     particles gather
 *   0.40  design      field tightens, camera pushes in
 *   0.60  fabric      silk cloth resolves out of the particles
 *   0.80  sell        cloth catches Sky light, motes fan out to channels
 *   1.00  get paid    warm coins rise off the cloth
 */
"use client"

import { useMemo, useRef, type RefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const smooth = THREE.MathUtils.smoothstep
const lerp = THREE.MathUtils.lerp

export type Pointer = { x: number; y: number }

/* ─── silk cloth (wave-displaced plane, custom shader) ───────────────────── */

const clothVertex = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uForm;
  varying vec2 vUv;
  varying float vElev;
  void main() {
    vUv = uv;
    vec3 p = position;
    float amp = 0.16 + uForm * 0.44;
    float w1 = sin(p.x * 2.6 + uTime * 1.1) * cos(p.y * 1.9 + uTime * 0.75);
    float w2 = sin((p.x + p.y) * 1.7 - uTime * 1.4);
    float elev = (w1 * 0.62 + w2 * 0.38) * amp;
    p.z += elev;
    vElev = elev;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const clothFragment = /* glsl */ `
  precision highp float;
  uniform float uForm;
  uniform float uWarm;
  varying vec2 vUv;
  varying float vElev;
  void main() {
    vec3 deep  = vec3(0.259, 0.333, 0.580);  // #425594 ink
    vec3 mid   = vec3(0.329, 0.459, 0.706);  // #5475b4
    vec3 light = vec3(0.780, 0.843, 0.960);  // periwinkle light
    vec3 gold  = vec3(0.914, 0.788, 0.541);  // warm payout tint
    float g = clamp(vUv.y * 0.7 + vElev * 0.55 + 0.28, 0.0, 1.0);
    vec3 col = mix(deep, mid, smoothstep(0.0, 0.6, g));
    col = mix(col, light, smoothstep(0.55, 1.0, g));
    // warm sheen washes across as we reach "get paid"
    col = mix(col, gold, uWarm * smoothstep(0.3, 1.0, g) * 0.5);
    float sheen = smoothstep(0.15, 0.95, vElev + 0.5);
    col += sheen * 0.14;
    float alpha = clamp(0.20 + uForm * 0.78, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

function SilkCloth({ progressRef }: { progressRef: RefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uForm: { value: 0 }, uWarm: { value: 0 } }),
    []
  )
  useFrame((_, dt) => {
    const p = progressRef.current ?? 0
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt
      // fabric resolves through design → fabric
      mat.current.uniforms.uForm.value = smooth(p, 0.34, 0.66)
      // warms toward the payout beat
      mat.current.uniforms.uWarm.value = smooth(p, 0.78, 1.0)
    }
    if (mesh.current) mesh.current.rotation.z = -0.15 + p * 0.12
  })
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.35, 0, -0.15]}>
      <planeGeometry args={[9, 6, 140, 96]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={clothVertex}
        fragmentShader={clothFragment}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─── particle field (gathers, then sinks into the cloth) ────────────────── */

const rand = (i: number, salt: number) => {
  const v = Math.sin(i * salt) * 43758.5453
  return v - Math.floor(v)
}

function ParticleField({ progressRef, pointerRef }: { progressRef: RefObject<number>; pointerRef: RefObject<Pointer> }) {
  const pts = useRef<THREE.Points>(null)
  const mat = useRef<THREE.PointsMaterial>(null)
  const drift = useRef({ x: 0, y: 0 })
  const COUNT = 1500
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = rand(i, 12.9898) * 11 - 5.5
      positions[i * 3 + 1] = rand(i, 78.233) * 5.5 - 0.5
      positions[i * 3 + 2] = rand(i, 37.719) * 9 - 4.5
      seeds[i] = i * 0.37
    }
    return { positions, seeds }
  }, [])
  useFrame(({ clock }) => {
    const p = progressRef.current ?? 0
    const t = clock.getElapsedTime()
    const geo = pts.current?.geometry
    if (geo) {
      const arr = geo.attributes.position.array as Float32Array
      const pull = smooth(p, 0.25, 0.62)      // sink into the cloth
      const fan = smooth(p, 0.66, 0.9)         // fan outward at "sell"
      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i]
        const baseY = arr[i * 3 + 1]
        arr[i * 3 + 1] = baseY + Math.sin(t * 0.6 + s) * 0.006 * (1 - pull) - baseY * 0.022 * pull
        arr[i * 3 + 0] += Math.sin(t * 0.4 + s * 1.3) * 0.004 * (1 - pull) + Math.cos(s) * 0.01 * fan
      }
      geo.attributes.position.needsUpdate = true
    }
    // the field itself slides toward the pointer (stronger before it condenses)
    const pt = pointerRef.current ?? { x: 0, y: 0 }
    const sway = 1 - smooth(p, 0.4, 0.7)
    drift.current.x = lerp(drift.current.x, pt.x * 0.9 * sway, 0.05)
    drift.current.y = lerp(drift.current.y, pt.y * 0.6 * sway, 0.05)
    if (pts.current) pts.current.position.set(drift.current.x, drift.current.y, 0)
    if (mat.current) mat.current.opacity = 0.55 * (1 - smooth(p, 0.5, 0.92))
  })
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.035}
        color="#9cbaea"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── coins — warm motes that rise off the cloth in the payout beat ──────── */

function CoinField({ progressRef }: { progressRef: RefObject<number> }) {
  const pts = useRef<THREE.Points>(null)
  const mat = useRef<THREE.PointsMaterial>(null)
  const COUNT = 120
  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const x = rand(i, 9.17) * 7 - 3.5
      const z = rand(i, 22.71) * 4 - 2
      base[i * 3 + 0] = x
      base[i * 3 + 1] = rand(i, 5.31) // per-coin phase / speed seed
      base[i * 3 + 2] = z
      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = z
    }
    return { positions, base }
  }, [])
  useFrame(({ clock }) => {
    const p = progressRef.current ?? 0
    const rise = smooth(p, 0.72, 1.0)
    const t = clock.getElapsedTime()
    const geo = pts.current?.geometry
    if (geo) {
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        const seed = base[i * 3 + 1]
        const climb = ((t * (0.35 + seed * 0.5) + seed * 10) % 3.2)
        arr[i * 3 + 0] = base[i * 3 + 0] + Math.sin(t * 0.8 + seed * 6) * 0.15
        arr[i * 3 + 1] = climb * rise * 1.4
        arr[i * 3 + 2] = base[i * 3 + 2]
      }
      geo.attributes.position.needsUpdate = true
    }
    if (mat.current) mat.current.opacity = 0.9 * rise
  })
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.11}
        color="#f0d9a6"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── camera dolly (scroll) + mouse parallax ─────────────────────────────── */

function Rig({ progressRef, pointerRef }: { progressRef: RefObject<number>; pointerRef: RefObject<Pointer> }) {
  const { camera } = useThree()
  const eased = useRef({ x: 0, y: 0 })
  useFrame(() => {
    const p = progressRef.current ?? 0
    const push = smooth(p, 0.0, 0.72)
    const z = lerp(8.6, 3.7, push)
    let y = lerp(3.6, 1.1, push)
    y += smooth(p, 0.82, 1.0) * 1.3 // lift to watch the coins rise

    // ease the pointer toward its target so the follow feels weighted
    const pt = pointerRef.current ?? { x: 0, y: 0 }
    eased.current.x = lerp(eased.current.x, pt.x, 0.06)
    eased.current.y = lerp(eased.current.y, pt.y, 0.06)

    camera.position.set(
      Math.sin(p * 0.6) * 0.8 + eased.current.x * 1.1,
      y - eased.current.y * 0.7,
      z
    )
    camera.lookAt(eased.current.x * 0.5, smooth(p, 0.8, 1.0) * 0.5, 0)
  })
  return null
}

function Scene({ progressRef, pointerRef }: { progressRef: RefObject<number>; pointerRef: RefObject<Pointer> }) {
  return (
    <>
      <color attach="background" args={["#0b0f1c"]} />
      <fog attach="fog" args={["#0b0f1c", 6, 15]} />
      <ambientLight intensity={0.6} />
      <SilkCloth progressRef={progressRef} />
      <ParticleField progressRef={progressRef} pointerRef={pointerRef} />
      <CoinField progressRef={progressRef} />
      <Rig progressRef={progressRef} pointerRef={pointerRef} />
    </>
  )
}

export function CreateCanvas({ progressRef, pointerRef }: { progressRef: RefObject<number>; pointerRef: RefObject<Pointer> }) {
  return (
    <Canvas camera={{ position: [0, 3.6, 8.6], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
      <Scene progressRef={progressRef} pointerRef={pointerRef} />
    </Canvas>
  )
}

export default CreateCanvas
