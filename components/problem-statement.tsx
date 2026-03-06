'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    TableCellsIcon,
    ChatBubbleLeftRightIcon,
    PencilSquareIcon,
    ShoppingBagIcon,
    SwatchIcon,
    UsersIcon,
    BuildingStorefrontIcon,
    ArchiveBoxIcon,
} from '@heroicons/react/24/outline'
import { Heading, Lead } from '@/components/text'
import { Container } from '@/components/container'

// ─── Flower-of-life SVG for JYT hub ───────────────────────────────────────────
function JYTFlower({ dark }: { dark?: boolean }) {
    const stroke = dark ? '#A3E635' : '#585944'
    const strokeOpacity = dark ? 1 : 0.7
    const d = 80, r = 90
    const petals = [270, 342, 54, 126, 198].map((deg) => {
        const rad = (deg * Math.PI) / 180
        return { cx: d * Math.cos(rad), cy: d * Math.sin(rad) }
    })

    return (
        <svg viewBox="-220 -220 440 440" className="w-full h-full" style={{ overflow: 'visible' }}>
            <defs>
                {/* Grain noise filter for texture */}
                <filter id="jytGrain" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="noise" />
                    <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
                    <feBlend in="SourceGraphic" in2="grey" mode="overlay" result="blended" />
                    <feComposite in="blended" in2="SourceGraphic" operator="in" />
                </filter>
                {/* Subtle fill for petals */}
                <radialGradient id="petalFillDark" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A3E635" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#A3E635" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="petalFillLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#585944" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#585944" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Outer concentric dashed rings */}
            <circle cx="0" cy="0" r="200" fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 8" strokeOpacity="0.2" />
            <circle cx="0" cy="0" r="155" fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 6" strokeOpacity="0.28" />
            <circle cx="0" cy="0" r="115" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="2 5" strokeOpacity="0.32" />

            {/* 5 petal circles: textured fill + stroke */}
            {petals.map((p, i) => (
                <g key={i}>
                    {/* Subtle fill with texture via grain filter */}
                    <circle cx={p.cx} cy={p.cy} r={r} fill={dark ? 'url(#petalFillDark)' : 'url(#petalFillLight)'} filter="url(#jytGrain)" />
                    {/* Bold border stroke */}
                    <circle cx={p.cx} cy={p.cy} r={r} fill="none" stroke={stroke} strokeWidth="2" strokeOpacity={strokeOpacity} />
                </g>
            ))}

            {/* Dot markers at petal centres */}
            {petals.map((p, i) => (
                <circle key={`dot-${i}`} cx={p.cx} cy={p.cy} r="3" fill={stroke} opacity={dark ? 0.7 : 0.45} />
            ))}

            {/* Centre convergence dot */}
            <circle cx="0" cy="0" r="4" fill={stroke} opacity={dark ? 0.9 : 0.6} />

            {/* Crosshair */}
            <line x1="0" y1="-18" x2="0" y2="18" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.35" />
            <line x1="-18" y1="0" x2="18" y2="0" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.35" />
        </svg>
    )
}

// ─── Chaotic scribble for Manual hub ──────────────────────────────────────────
function ManualChaos({ dark }: { dark?: boolean }) {
    const stroke = dark ? '#ef4444' : '#8c8c6a'
    return (
        <svg viewBox="-200 -200 400 400" className="w-full h-full" style={{ overflow: 'visible' }}>
            {/* Rough outer circle */}
            <path
                d="M0,-155 C60,-158 130,-100 148,-30 C165,40 140,120 80,158 C20,196 -70,188 -130,140 C-190,92 -200,10 -175,-60 C-150,-130 -90,-170 0,-155 Z"
                fill="none" stroke={stroke} strokeWidth="1.6" strokeOpacity="0.35"
                strokeDasharray="8 5"
            />
            {/* Rough inner circle */}
            <path
                d="M0,-108 C35,-112 90,-70 102,-20 C114,30 95,88 50,112 C5,136 -52,128 -88,88 C-124,48 -128,-20 -102,-68 C-76,-116 -50,-106 0,-108 Z"
                fill="none" stroke={stroke} strokeWidth="1.3" strokeOpacity="0.4"
                strokeDasharray="4 7"
            />
            {/* Cross-lines */}
            <line x1="-80" y1="-80" x2="60" y2="40" stroke={stroke} strokeWidth="1" strokeOpacity="0.25" />
            <line x1="80" y1="-60" x2="-50" y2="70" stroke={stroke} strokeWidth="1" strokeOpacity="0.2" />
            <line x1="-40" y1="-100" x2="20" y2="90" stroke={stroke} strokeWidth="0.8" strokeOpacity="0.18" />
            {/* Small scattered dots */}
            {[[-50, -70], [70, -40], [100, 40], [30, 90], [-80, 50], [-30, -120], [110, -20]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2" fill={stroke} opacity="0.35" />
            ))}
        </svg>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ProblemStatement() {
    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const shouldReduceMotion = useReducedMotion()

    const updateSliderPosition = useCallback((clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const clamped = Math.max(rect.width * 0.15, Math.min(x, rect.width * 0.85))
        setSliderPosition((clamped / rect.width) * 100)
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        updateSliderPosition(e.clientX)
    }, [updateSliderPosition])

    const handleMouseDown = useCallback(() => {
        setIsDragging(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        updateSliderPosition(e.touches[0].clientX)
    }, [updateSliderPosition])

    const handleTouchStart = useCallback(() => {
        setIsDragging(true)
    }, [])

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const step = 5
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            setSliderPosition(prev => Math.max(15, prev - step))
        } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            setSliderPosition(prev => Math.min(85, prev + step))
        } else if (e.key === 'Home') {
            e.preventDefault()
            setSliderPosition(15)
        } else if (e.key === 'End') {
            e.preventDefault()
            setSliderPosition(85)
        }
    }, [])

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false)
        window.addEventListener('mouseup', handleGlobalMouseUp)
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
    }, [])

    return (
        <section className="relative z-0 overflow-hidden pt-12 sm:pt-16 pb-24 sm:pb-32 bg-olive-50 dark:bg-[#0B0F0B] font-sans transition-colors duration-300">
            <Container className="relative z-0 mb-12">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4">
                    <Heading as="h2" className="mb-6">
                        Build and isolate.
                    </Heading>
                    <Lead className="text-balance">
                        Spreadsheets. Notes. WhatsApp. Storefronts.<br className="hidden sm:block" />
                        JaalYantra replaces the fragmented chaos with a single, highly structured workspace optimized for modern fashion brands.
                    </Lead>
                </div>
            </Container>

            <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
                <div
                    ref={containerRef}
                    className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-olive-200/80 dark:border-white/5 cursor-ew-resize select-none"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    role="slider"
                    aria-label="Compare manual workflow with JaalYantra solution"
                    aria-valuemin={15}
                    aria-valuemax={85}
                    aria-valuenow={Math.round(sliderPosition)}
                    aria-valuetext={`${Math.round(sliderPosition)}% showing JaalYantra solution`}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >

                    {/* ═══════════════════════════════════════════════════════
                        BASE LAYER — "The Old Way" / Manual / Chaos
                        Clipped from RIGHT. Hub at left-[25%].
                        Icons: left-[2%] to left-[46%].
                    ═══════════════════════════════════════════════════════ */}
                    <div
                        className="absolute inset-0 bg-olive-100 dark:bg-[#0A0A0A] transition-colors duration-300"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                        {/* Chaotic dot grid */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(88,89,68,0.08)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,rgba(239,68,68,0.09)_1px,transparent_0)] bg-[length:28px_28px] pointer-events-none" />

                        {/* Manual chaos visual — centred at true center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none">
                            {/* Light mode chaos */}
                            <div className="block dark:hidden w-full h-full">
                                <ManualChaos dark={false} />
                            </div>
                            {/* Dark mode chaos */}
                            <div className="hidden dark:block w-full h-full">
                                <ManualChaos dark={true} />
                            </div>
                            {/* "Manual" label inside the rough circle */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-serif italic text-xl text-olive-500/60 dark:text-red-400/40 transition-colors duration-300 select-none">
                                    Manual
                                </span>
                            </div>
                        </div>

                        {/* Chaos icons — left-[2%] to left-[44%] */}
                        <motion.div className="absolute flex flex-col items-center gap-1 will-change-transform" style={{ top: '10%', left: '3%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-4, 4, -4], rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <PencilSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Scratch Pad</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 will-change-transform" style={{ top: '48%', left: '2%' }}
                            animate={shouldReduceMotion ? undefined : { y: [5, -5, 5], rotate: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.3 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Excel</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 will-change-transform" style={{ bottom: '10%', left: '4%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-3, 3, -3], rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.8 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">WhatsApp</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1" style={{ top: '14%', left: '14%' }}
                            animate={{ y: [-5, 5, -5], rotate: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Spreadsheets</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1" style={{ bottom: '22%', left: '13%' }}
                            animate={{ y: [4, -4, 4], rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">E-commerce</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1" style={{ top: '20%', left: '34%' }}
                            animate={{ y: [-4, 4, -4], rotate: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.2 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Chat</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1" style={{ bottom: '12%', left: '34%' }}
                            animate={{ y: [3, -3, 3], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.6 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <PencilSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Notes</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1" style={{ top: '55%', left: '38%' }}
                            animate={{ y: [-3, 3, -3], rotate: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 5.1, ease: 'easeInOut', delay: 1.2 }}>
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-colors duration-300">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap">Data Sheets</span>
                        </motion.div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        OVERLAY LAYER — "The JYT Way" / Structured / Clean
                        Clipped from LEFT. Hub at left-[75%].
                        Icons: left-[54%] to left-[93%].
                    ═══════════════════════════════════════════════════════ */}
                    <div
                        className="absolute inset-0 bg-olive-50 dark:bg-[#0B0F0B] z-20 transition-colors duration-300"
                        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    >
                        {/* Structured dot grid */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(88,89,68,0.07)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,rgba(163,230,53,0.06)_1px,transparent_0)] bg-[length:28px_28px] pointer-events-none" />

                        {/* ── JYT Flower Hub — centred at true center */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] pointer-events-none"
                            animate={{ rotate: [0, 1, 0, -1, 0] }}
                            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                        >
                            <div className="block dark:hidden w-full h-full"><JYTFlower dark={false} /></div>
                            <div className="hidden dark:block w-full h-full"><JYTFlower dark={true} /></div>
                            {/* JYT text removed */}
                        </motion.div>




                        {/* JYT feature icons — simple floaters, right half */}
                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ top: '10%', left: '57%' }}
                            animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <SwatchIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Design Tracing</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ top: '12%', left: '83%' }}
                            animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <ArchiveBoxIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Inventory</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ top: '46%', left: '91%' }}
                            animate={{ y: [-2, 2, -2], x: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <UsersIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Supplier Portal</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ top: '38%', left: '62%' }}
                            animate={{ y: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.3 }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Orders</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ bottom: '14%', left: '57%' }}
                            animate={{ y: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.8 }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <BuildingStorefrontIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Payments</span>
                        </motion.div>

                        <motion.div className="absolute flex flex-col items-center gap-1 z-10" style={{ bottom: '18%', left: '81%' }}
                            animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.2 }}>
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-colors duration-300">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300">Sheets</span>
                        </motion.div>

                        {/* Animated cursors */}
                        <motion.div
                            className="absolute pointer-events-none flex items-center gap-2 z-30"
                            style={{ top: '26%', left: '68%' }}
                            animate={{ x: [0, 30, 0], y: [0, -22, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-olive-500 dark:text-pink-400 -rotate-90 flex-shrink-0 transition-colors duration-300">
                                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86H19.5c.32 0 .5-.4.27-.63L5.5 3.21z" fill="currentColor" />
                            </svg>
                            <span className="bg-olive-200/90 dark:bg-pink-500/20 text-olive-800 dark:text-pink-300 border border-olive-300/60 dark:border-pink-500/30 text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap backdrop-blur-sm transition-colors duration-300">
                                Inventory Sync
                            </span>
                        </motion.div>

                        <motion.div
                            className="absolute pointer-events-none flex items-center gap-2 z-30"
                            style={{ top: '62%', left: '75%' }}
                            animate={{ x: [0, 35, 0], y: [0, 18, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1.5 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-olive-600 dark:text-lime-400 -rotate-45 flex-shrink-0 transition-colors duration-300">
                                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86H19.5c.32 0 .5-.4.27-.63L5.5 3.21z" fill="currentColor" />
                            </svg>
                            <span className="bg-olive-600 dark:bg-lime-400 text-white dark:text-black text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap transition-colors duration-300">
                                AI Agent
                            </span>
                        </motion.div>
                    </div>

                    {/* ─── Slider divider ──────────────────────────────────── */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-olive-400/40 dark:bg-white/20 z-30 pointer-events-none"
                        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    />
                    {/* Handle */}
                    <div
                        className="absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border border-olive-300/60 dark:border-white/20 shadow-lg flex items-center justify-center pointer-events-none transition-colors duration-300"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-olive-500 dark:text-white/60 transition-colors duration-300">
                            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                </div>
            </div>
        </section>
    )
}