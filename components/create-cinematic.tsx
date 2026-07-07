/**
 * CREATE — one cinematic, scroll-scrubbed scene.
 *
 * A single scroll-pinned WebGL section that carries the whole "create" story in
 * one continuous, movie-like move: a periwinkle particle field (INSPIRE) that
 * tightens and zooms (DESIGN) and finally resolves into an undulating 3D silk
 * cloth (FABRIC) — rolling under Sky light. Everything is scrubbed off scroll
 * progress, so it tracks the scrollbar 1:1.
 *
 * three + @react-three/fiber. The <Canvas> is client-only; the section is
 * dynamically imported with ssr:false from the create page. Honours
 * prefers-reduced-motion (renders a plain stacked read, no canvas).
 */
"use client"

import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from "framer-motion"
import * as THREE from "three"

/* ─── stages ─────────────────────────────────────────────────────────────── */

const STAGES = [
  { label: "Inspire", title: "From the art that moves you", blurb: "A sketch, a photo, a museum plate. The system reads palette, motif and mood — and turns a spark into a brief." },
  { label: "Design", title: "Woven into a spec", blurb: "Pattern, colourway, bill of materials and sizes resolve into a techpack a vetted atelier can run — no loose files." },
  { label: "Fabric", title: "Made real, thread by thread", blurb: "Cloth comes off the loom with a passport attached — verifiable provenance from the first idea to the last stitch." },
]

/* ─── silk cloth (wave-displaced plane, custom shader) ───────────────────── */

const clothVertex = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vElev;
  void main() {
    vUv = uv;
    vec3 p = position;
    float amp = 0.28 + uProgress * 0.32;
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
  uniform float uProgress;
  varying vec2 vUv;
  varying float vElev;
  void main() {
    vec3 deep  = vec3(0.259, 0.333, 0.580);  // #425594 ink
    vec3 mid   = vec3(0.329, 0.459, 0.706);  // #5475b4
    vec3 light = vec3(0.780, 0.843, 0.960);  // periwinkle light
    float g = clamp(vUv.y * 0.7 + vElev * 0.55 + 0.28, 0.0, 1.0);
    vec3 col = mix(deep, mid, smoothstep(0.0, 0.6, g));
    col = mix(col, light, smoothstep(0.55, 1.0, g));
    float sheen = smoothstep(0.15, 0.95, vElev + 0.5);
    col += sheen * 0.14;
    float alpha = clamp(0.30 + uProgress * 0.68, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

function SilkCloth({ progressRef }: { progressRef: RefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uProgress: { value: 0 } }),
    []
  )
  useFrame((_, dt) => {
    const p = progressRef.current ?? 0
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt
      // fabric only truly forms in the back half of the scroll
      mat.current.uniforms.uProgress.value = THREE.MathUtils.smoothstep(p, 0.35, 1.0)
    }
    if (mesh.current) {
      mesh.current.rotation.z = -0.15 + p * 0.1
    }
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

/* ─── particle field (absorbed into the cloth as progress → 1) ───────────── */

function ParticleField({ progressRef }: { progressRef: RefObject<number> }) {
  const pts = useRef<THREE.Points>(null)
  const mat = useRef<THREE.PointsMaterial>(null)
  const COUNT = 1400
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 10 - 5
      positions[i * 3 + 1] = (Math.sin(i * 78.233) * 43758.5453 % 1) * 5 - 1
      positions[i * 3 + 2] = (Math.sin(i * 37.719) * 43758.5453 % 1) * 8 - 4
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
      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i]
        // drift in waves; as progress rises, sink toward the cloth (y→0) and settle
        const pull = THREE.MathUtils.smoothstep(p, 0.3, 0.95)
        const baseY = arr[i * 3 + 1]
        arr[i * 3 + 1] = baseY + Math.sin(t * 0.6 + s) * 0.006 * (1 - pull) - baseY * 0.02 * pull
        arr[i * 3 + 0] += Math.sin(t * 0.4 + s * 1.3) * 0.004 * (1 - pull)
      }
      geo.attributes.position.needsUpdate = true
    }
    if (mat.current) {
      mat.current.opacity = 0.55 * (1 - THREE.MathUtils.smoothstep(p, 0.5, 1.0))
    }
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

/* ─── camera dolly driven by scroll ──────────────────────────────────────── */

function Rig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree()
  useFrame(() => {
    const p = progressRef.current ?? 0
    const z = THREE.MathUtils.lerp(7.2, 3.6, p)
    const y = THREE.MathUtils.lerp(3.0, 1.0, p)
    camera.position.set(Math.sin(p * 0.5) * 0.6, y, z)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene({ progressRef }: { progressRef: RefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#0b0f1c"]} />
      <fog attach="fog" args={["#0b0f1c", 6, 14]} />
      <ambientLight intensity={0.6} />
      <SilkCloth progressRef={progressRef} />
      <ParticleField progressRef={progressRef} />
      <Rig progressRef={progressRef} />
    </>
  )
}

/* ─── reduced-motion fallback ────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

/* ─── the section ────────────────────────────────────────────────────────── */

export function CreateCinematic() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const progressRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v
    const i = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length + 0.0001)))
    if (i !== active) setActive(i)
  })
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduced) {
    return (
      <section className="cin-scroll cin-scroll--reduced" aria-label="How create works">
        {STAGES.map((s, i) => (
          <div className="cin-static" key={s.label}>
            <span className="cin-card-eyebrow">{String(i + 1).padStart(2, "0")} · {s.label.toUpperCase()}</span>
            <h3 className="cin-card-title">{s.title}</h3>
            <p className="cin-card-blurb">{s.blurb}</p>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="cin-scroll" ref={ref} aria-label="How create works" style={{ height: "420vh" }}>
      <div className="cin-pin">
        <div className="cin-canvas">
          <Canvas camera={{ position: [0, 3, 7.2], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
            <Scene progressRef={progressRef} />
          </Canvas>
        </div>

        <div className="cin-eyebrow">
          <span className="kt-create-tag">Create · one continuous scene</span>
        </div>

        <div className="cin-copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="cin-card-eyebrow">{String(active + 1).padStart(2, "0")} · {STAGES[active].label.toUpperCase()}</span>
              <h3 className="cin-card-title">{STAGES[active].title}</h3>
              <p className="cin-card-blurb">{STAGES[active].blurb}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="kt-stage-rail" aria-hidden>
          <div className="kt-stage-rail-track">
            <motion.div className="kt-stage-rail-fill" style={{ scaleY: railScale }} />
          </div>
          <div className="kt-stage-rail-ticks">
            {STAGES.map((s, i) => (
              <div key={s.label} className={`kt-stage-rail-tick${i === active ? " active" : ""}${i < active ? " done" : ""}`}>
                <span className="kt-stage-rail-dot" />
                <span className="kt-stage-rail-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateCinematic
