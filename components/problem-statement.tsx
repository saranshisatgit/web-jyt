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

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        updateSliderPosition(e.clientX)
    }, [updateSliderPosition])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        updateSliderPosition(e.clientX)
    }, [isDragging, updateSliderPosition])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true)
        updateSliderPosition(e.touches[0].clientX)
    }, [updateSliderPosition])

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return
        updateSliderPosition(e.touches[0].clientX)
    }, [isDragging, updateSliderPosition])

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

                        {/* Chaos icons — left-[2%] to left-[44%] with hover shake */}
                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ top: '10%', left: '3%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-4, 4, -4], rotate: [-4, 4, -4] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [-8, 8, -8, 8, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <PencilSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Scratch Pad</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ top: '48%', left: '2%' }}
                            animate={shouldReduceMotion ? undefined : { y: [5, -5, 5], rotate: [5, -5, 5] }} 
                            transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.3 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [8, -8, 8, -8, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Excel</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ bottom: '10%', left: '4%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-3, 3, -3], rotate: [-6, 6, -6] }} 
                            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.8 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [-10, 10, -10, 10, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">WhatsApp</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ top: '14%', left: '14%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-5, 5, -5], rotate: [3, -3, 3] }} 
                            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [-6, 6, -6, 6, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Spreadsheets</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ bottom: '22%', left: '13%' }}
                            animate={shouldReduceMotion ? undefined : { y: [4, -4, 4], rotate: [-4, 4, -4] }} 
                            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [8, -8, 8, -8, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">E-commerce</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ top: '20%', left: '34%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-4, 4, -4], rotate: [5, -5, 5] }} 
                            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.2 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [-7, 7, -7, 7, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Chat</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ bottom: '12%', left: '34%' }}
                            animate={shouldReduceMotion ? undefined : { y: [3, -3, 3], rotate: [-5, 5, -5] }} 
                            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.6 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [9, -9, 9, -9, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <PencilSquareIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Notes</span>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 will-change-transform group cursor-pointer" 
                            style={{ top: '55%', left: '38%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-3, 3, -3], rotate: [4, -4, 4] }} 
                            transition={{ repeat: Infinity, duration: 5.1, ease: 'easeInOut', delay: 1.2 }}
                            whileHover={shouldReduceMotion ? undefined : { rotate: [-5, 5, -5, 5, 0], scale: 1.05 }}
                        >
                            <div className="w-9 h-9 rounded-xl border border-olive-400/50 dark:border-red-500/30 bg-olive-50 dark:bg-[#1a1212] flex items-center justify-center text-olive-600/80 dark:text-red-400/70 transition-all duration-300 group-hover:border-red-400/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-500/80 dark:text-red-400/50 whitespace-nowrap group-hover:text-red-500/80 transition-colors">Data Sheets</span>
                        </motion.div>

                        {/* Connection lines showing chaos - broken/disconnected */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-30" style={{ zIndex: 5 }}>
                            <line x1="3%" y1="12%" x2="14%" y2="18%" stroke="currentColor" className="text-olive-400 dark:text-red-500" strokeWidth="1" strokeDasharray="4 6" />
                            <line x1="2%" y1="50%" x2="13%" y2="72%" stroke="currentColor" className="text-olive-400 dark:text-red-500" strokeWidth="1" strokeDasharray="3 8" />
                            <line x1="4%" y1="88%" x2="34%" y2="82%" stroke="currentColor" className="text-olive-400 dark:text-red-500" strokeWidth="1" strokeDasharray="5 5" />
                            <line x1="34%" y1="25%" x2="38%" y2="58%" stroke="currentColor" className="text-olive-400 dark:text-red-500" strokeWidth="0.8" strokeDasharray="2 10" />
                        </svg>

                        {/* Disconnected data flow indicators */}
                        <motion.div 
                            className="absolute pointer-events-none"
                            style={{ top: '30%', left: '20%' }}
                            animate={shouldReduceMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        >
                            <div className="text-[10px] font-mono text-olive-500/60 dark:text-red-400/40 line-through">sync failed</div>
                        </motion.div>

                        {/* Chaos Side - Error Cards */}
                        <motion.div 
                            className="absolute pointer-events-none"
                            style={{ top: '65%', left: '8%' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="bg-red-50/90 dark:bg-red-950/40 border border-red-300/60 dark:border-red-500/30 rounded-lg p-2 shadow-lg backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[8px] font-mono uppercase text-red-600 dark:text-red-400 font-semibold">Order Delayed</span>
                                </div>
                                <div className="text-[7px] text-red-500/70 dark:text-red-400/60 font-mono">Status: 3 days overdue</div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="absolute pointer-events-none"
                            style={{ top: '25%', left: '25%' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-500/30 rounded-lg p-2 shadow-lg backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[8px] font-mono uppercase text-amber-600 dark:text-amber-400 font-semibold">Design Not Found</span>
                                </div>
                                <div className="text-[7px] text-amber-500/70 dark:text-amber-400/60 font-mono">File: version_3_final_FINAL.ai</div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="absolute pointer-events-none"
                            style={{ bottom: '35%', left: '28%' }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                        >
                            <div className="bg-gray-100/90 dark:bg-gray-900/60 border border-gray-300/60 dark:border-gray-600/30 rounded-lg p-2 shadow-lg backdrop-blur-sm">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                    <span className="text-[8px] font-mono uppercase text-gray-600 dark:text-gray-400 font-semibold">Messages Lost</span>
                                </div>
                                <div className="text-[7px] text-gray-500/70 dark:text-gray-400/60 font-mono">12 unread in 5 threads</div>
                            </div>
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
                        </motion.div>

                        {/* Center text - From Chaos to Unification */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="text-center">
                                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-olive-600 dark:text-lime-400 font-semibold whitespace-nowrap">
                                    From Chaos
                                </div>
                                <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-olive-500/70 dark:text-lime-400/70 mt-1 whitespace-nowrap">
                                    to Unification & Peace
                                </div>
                            </div>
                        </motion.div>




                        {/* Pulsing data flow particles - matching icon positions */}
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '10%', left: '57%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['10%', '50%'],
                                left: ['57%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '12%', left: '83%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['12%', '50%'],
                                left: ['83%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2.3, ease: 'easeOut', delay: 0.5 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '46%', left: '91%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['46%', '50%'],
                                left: ['91%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut', delay: 1 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '40%', left: '64%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['40%', '50%'],
                                left: ['64%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2.1, ease: 'easeOut', delay: 0.3 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '82%', left: '57%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['82%', '50%'],
                                left: ['57%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut', delay: 0.7 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{ top: '78%', left: '81%' }}
                            animate={shouldReduceMotion ? undefined : { 
                                top: ['78%', '50%'],
                                left: ['81%', '50%'],
                                opacity: [0.8, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1.9, ease: 'easeOut', delay: 1.2 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-olive-400 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                        </motion.div>

                        {/* JYT feature icons — positioned at line endpoints with hover glow and scale */}
                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ top: '10%', left: '57%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-3, 3, -3] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <SwatchIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Design Tracing</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                                initial={{ y: 5 }}
                                whileHover={{ y: 0 }}
                            >
                                Connected
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ top: '12%', left: '83%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-2, 2, -2] }} 
                            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <ArchiveBoxIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Inventory</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                            >
                                Real-time sync
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ top: '46%', left: '91%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-2, 2, -2], x: [1, -1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <UsersIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Supplier Portal</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                            >
                                Unified access
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ top: '40%', left: '64%' }}
                            animate={shouldReduceMotion ? undefined : { y: [2, -2, 2] }} 
                            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.3 }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Orders</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                            >
                                Auto-fulfill
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ bottom: '18%', left: '57%' }}
                            animate={shouldReduceMotion ? undefined : { y: [3, -3, 3] }} 
                            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.8 }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <BuildingStorefrontIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Payments</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                            >
                                Integrated
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="absolute flex flex-col items-center gap-1 z-10 will-change-transform group cursor-pointer" 
                            style={{ bottom: '22%', left: '81%' }}
                            animate={shouldReduceMotion ? undefined : { y: [-2, 2, -2] }} 
                            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.2 }}
                            whileHover={{ scale: 1.15, y: -5 }}
                        >
                            <div className="w-10 h-10 rounded-full border border-olive-500/40 dark:border-lime-400/40 bg-olive-100 dark:bg-[#0B0F0B] flex items-center justify-center text-olive-600 dark:text-lime-400 shadow-[0_0_14px_rgba(88,89,68,0.08)] dark:shadow-[0_0_14px_rgba(163,230,53,0.18)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] group-hover:border-lime-400/80 dark:group-hover:shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                                <TableCellsIcon className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-[8px] tracking-widest uppercase text-olive-600 dark:text-lime-400 font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-lime-500">Sheets</span>
                            <motion.div 
                                className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-olive-500/70 dark:text-lime-300/70 whitespace-nowrap"
                            >
                                Live data
                            </motion.div>
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

                    {/* Storytelling labels - positioned outside the clipped areas */}
                    <motion.div 
                        className="absolute -top-12 left-0 z-50 pointer-events-none"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400/60 animate-pulse" />
                            <span className="text-[11px] font-mono uppercase tracking-wider text-olive-600 dark:text-red-400/80 font-semibold">The Old Way</span>
                            <span className="text-[10px] text-olive-500/60 dark:text-red-400/40">— Fragmented tools</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="absolute -top-12 right-0 z-50 pointer-events-none"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-olive-500/60 dark:text-lime-400/60">Unified workspace —</span>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-olive-600 dark:text-lime-400 font-semibold">The JYT Way</span>
                            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}