import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    startTransition,
} from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"

interface SlideItem {
    url: string
    title?: string
}

interface RecentEditsCarouselProps {
    slides: SlideItem[]
    autoPlay: boolean
    intervalSeconds: number
    borderRadius: number
    borderColor: string
    textColor: string
    mutedTextColor: string
    controlFillColor: string
    controlBorderColor: string
    titleFont: object
    metaFont: object
}

// ── YouTube helpers ────────────────────────────────────────────────────────
function getVideoId(url: string): string | null {
    if (!url) return null
    const clean = url.trim()
    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/)
    if (shortMatch?.[1]) return shortMatch[1]
    const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)
    if (watchMatch?.[1]) return watchMatch[1]
    const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/)
    if (shortsMatch?.[1]) return shortsMatch[1]
    const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/)
    if (embedMatch?.[1]) return embedMatch[1]
    return null
}

function getThumbnail(url: string): string {
    const id = getVideoId(url)
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ""
}

function getEmbedUrl(url: string): string {
    const id = getVideoId(url)
    if (!id) return ""
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&enablejsapi=1`
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function RecentEditsCarousel(props: RecentEditsCarouselProps) {
    const {
        slides = [
            { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Editorial Cut 01" },
            { url: "https://youtu.be/3JZ_D3ELwOQ",                 title: "Editorial Cut 02" },
            { url: "https://www.youtube.com/watch?v=L_jWHffIx5E",  title: "Editorial Cut 03" },
            { url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",  title: "Editorial Cut 04" },
            { url: "https://www.youtube.com/watch?v=kXYiU_JCYtU",  title: "Editorial Cut 05" },
        ],
        autoPlay = true,
        intervalSeconds = 5,
        borderRadius = 20,
        borderColor = "rgba(255,255,255,0.12)",
        textColor = "#FFFFFF",
        mutedTextColor = "rgba(255,255,255,0.50)",
        controlFillColor = "rgba(0,0,0,0.45)",
        controlBorderColor = "rgba(255,255,255,0.22)",
        titleFont = { fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "1em" } as any,
        metaFont  = { fontSize: "13px", fontWeight: 400, letterSpacing: "0em",     lineHeight: "1.3em" } as any,
    } = props

    const validSlides = useMemo(
        () => (slides || []).filter((s) => typeof s?.url === "string" && s.url.trim().length > 0),
        [slides]
    )

    const [currentIndex, setCurrentIndex] = useState(0)
    const [inited, setInited]             = useState(false)  // lazy: load iframes only after in-view
    // Track which slides user has clicked "Play" on → iframe is shown for those
    const [playing, setPlaying]           = useState<Set<number>>(new Set())

    const rootRef  = useRef<HTMLDivElement | null>(null)
    const inView   = useInView(rootRef, { amount: 0.3 })
    const isStatic = useIsStaticRenderer()

    const safeIndex    = validSlides.length > 0 ? currentIndex % validSlides.length : 0
    const currentSlide = validSlides[safeIndex]

    // ✅ Only init iframes when section scrolls into view (once)
    useEffect(() => {
        if (inView && !inited) setInited(true)
    }, [inView, inited])

    const goNext = useCallback(() => {
        if (validSlides.length <= 1) return
        startTransition(() => setCurrentIndex((p) => (p + 1) % validSlides.length))
    }, [validSlides.length])

    const goPrev = useCallback(() => {
        if (validSlides.length <= 1) return
        startTransition(() => setCurrentIndex((p) => (p - 1 + validSlides.length) % validSlides.length))
    }, [validSlides.length])

    // Auto-slide (advances index only — no iframe reload)
    useEffect(() => {
        if (!autoPlay || !inView || isStatic || validSlides.length <= 1) return
        const delay = Math.max(2, intervalSeconds) * 1000
        const id = window.setInterval(() => {
            startTransition(() => setCurrentIndex((p) => (p + 1) % validSlides.length))
        }, delay)
        return () => window.clearInterval(id)
    }, [autoPlay, inView, intervalSeconds, isStatic, validSlides.length])

    if (validSlides.length === 0) {
        return (
            <section ref={rootRef} style={{ width: "100%", borderRadius, padding: 20, color: textColor, background: "#000", border: `1px solid ${borderColor}`, boxSizing: "border-box" }}>
                Add at least one YouTube URL in the Slides control.
            </section>
        )
    }

    return (
        <section
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                background: "#000000",
                borderRadius,
                border: `1px solid ${borderColor}`,
                boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
                color: textColor,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* ── VIDEO AREA ─────────────────────────────────────────────── */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#050505" }}>

                {/*
                  ✅ KEY FIX: ALL slides are rendered simultaneously.
                  Only the current slide is visible (opacity:1 / pointerEvents:auto).
                  Iframes are NEVER re-mounted → zero reload on navigation.
                */}
                {validSlides.map((slide, index) => {
                    const isActive    = index === safeIndex
                    const isPlaying   = playing.has(index)
                    const thumb       = getThumbnail(slide.url)
                    const embedUrl    = inited ? getEmbedUrl(slide.url) : ""

                    return (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                inset: 0,
                                // CSS visibility — no unmount, no reload
                                opacity: isActive ? 1 : 0,
                                pointerEvents: isActive ? "auto" : "none",
                                transition: "opacity 0.45s ease",
                                zIndex: isActive ? 1 : 0,
                            }}
                        >
                            {/* Thumbnail (shown until user presses Play) */}
                            {!isPlaying && (
                                <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
                                    <img
                                        src={thumb}
                                        alt={slide.title || `Slide ${index + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                    {/* Play button — only on active slide */}
                                    {isActive && (
                                        <motion.button
                                            onClick={() => setPlaying((prev) => new Set([...prev, index]))}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.92 }}
                                            style={{
                                                position: "absolute",
                                                top: "50%", left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: 72, height: 72,
                                                borderRadius: "50%",
                                                background: "rgba(0,0,0,0.55)",
                                                backdropFilter: "blur(10px)",
                                                WebkitBackdropFilter: "blur(10px)",
                                                border: "2px solid rgba(255,255,255,0.3)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", outline: "none",
                                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                            }}
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                                <polygon points="5,3 19,12 5,21" />
                                            </svg>
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            {/* iframe — mounted once, never re-mounted */}
                            {inited && (
                                <iframe
                                    src={isPlaying ? embedUrl : "about:blank"}
                                    title={slide.title || `Slide ${index + 1}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                        position: "absolute", inset: 0,
                                        width: "100%", height: "100%",
                                        border: "none", display: "block",
                                        opacity: isPlaying ? 1 : 0,
                                        transition: "opacity 0.4s ease",
                                        zIndex: isPlaying ? 3 : -1,
                                    }}
                                />
                            )}
                        </div>
                    )
                })}

                {/* ── PREV / NEXT buttons ─────────────────────────────────── */}
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 clamp(10px, 2.5vw, 20px)",
                    pointerEvents: "none",
                    zIndex: 10,
                }}>
                    {[
                        { label: "prev", action: goPrev, d: "M14.5 5.5L8.5 12L14.5 18.5" },
                        { label: "next", action: goNext, d: "M9.5 5.5L15.5 12L9.5 18.5"  },
                    ].map(({ label, action, d }) => (
                        <motion.button
                            key={label}
                            type="button"
                            aria-label={label === "prev" ? "Previous" : "Next"}
                            onClick={action}
                            whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.94 }}
                            style={{
                                pointerEvents: "auto",
                                width: "clamp(34px, 6vw, 44px)",
                                height: "clamp(34px, 6vw, 44px)",
                                borderRadius: 999,
                                border: `1px solid ${controlBorderColor}`,
                                background: controlFillColor,
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                color: textColor,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                                outline: "none", padding: 0,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ── CAPTION ────────────────────────────────────────────────── */}
            <div style={{ padding: "12px 14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{
                    color: textColor,
                    ...(titleFont as any),
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1,
                }}>
                    {currentSlide?.title || `Recent Edit ${safeIndex + 1}`}
                </div>
                <div style={{ color: mutedTextColor, ...(metaFont as any), flexShrink: 0, whiteSpace: "nowrap" }}>
                    {safeIndex + 1} / {validSlides.length}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(RecentEditsCarousel, {
    slides: {
        type: ControlType.Array,
        title: "Slides",
        maxCount: 12,
        defaultValue: [
            { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Editorial Cut 01" },
            { url: "https://youtu.be/3JZ_D3ELwOQ",                 title: "Editorial Cut 02" },
            { url: "https://www.youtube.com/watch?v=L_jWHffIx5E",  title: "Editorial Cut 03" },
            { url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",  title: "Editorial Cut 04" },
            { url: "https://www.youtube.com/watch?v=kXYiU_JCYtU",  title: "Editorial Cut 05" },
        ],
        control: {
            type: ControlType.Object,
            controls: {
                url:   { type: ControlType.String, title: "URL",   defaultValue: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                title: { type: ControlType.String, title: "Title", defaultValue: "Recent Edit" },
            },
        },
    },
    autoPlay:        { type: ControlType.Boolean, title: "Auto Slide", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    intervalSeconds: { type: ControlType.Number,  title: "Interval",   defaultValue: 5, min: 2, max: 20, unit: "s" },
    borderRadius:    { type: ControlType.Number,  title: "Radius",     defaultValue: 20, min: 0, max: 48, unit: "px" },
    borderColor:     { type: ControlType.Color,   title: "Border",     defaultValue: "rgba(255,255,255,0.12)" },
    textColor:       { type: ControlType.Color,   title: "Text",       defaultValue: "#FFFFFF" },
    mutedTextColor:  { type: ControlType.Color,   title: "Muted Text", defaultValue: "rgba(255,255,255,0.50)" },
    controlFillColor:   { type: ControlType.Color, title: "Ctrl Fill",   defaultValue: "rgba(0,0,0,0.45)" },
    controlBorderColor: { type: ControlType.Color, title: "Ctrl Border", defaultValue: "rgba(255,255,255,0.22)" },
    titleFont: { type: ControlType.Font, title: "Title Font", defaultValue: { fontSize: "15px", variant: "Medium" }, controls: "extended", defaultFontType: "sans-serif" },
    metaFont:  { type: ControlType.Font, title: "Meta Font",  defaultValue: { fontSize: "13px", variant: "Regular" }, controls: "extended", defaultFontType: "sans-serif" },
})