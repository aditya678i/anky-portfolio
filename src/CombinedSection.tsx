import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"



// User request: Create a production-ready StickyTestimonialsMarquee for the Home testimonial section with GSAP ScrollTrigger pinning, three alternating infinite marquee rows, premium dark glass cards, responsive desktop/mobile behavior, reduced-motion/static fallbacks, and extensive Framer property controls.

export interface TestimonialItem {
    name: string
    company: string
    quote: string
    avatarUrl?: string
    avatar?: { src?: string; srcSet?: string; alt?: string }
}

export interface MyComponentProps {
    heading: string
    testimonials: TestimonialItem[]
    backgroundColor: string
    cardBackground: string
    borderColor: string
    headingColor: string
    textColor: string
    mutedColor: string
    radius: number
    avatarSize: number
    cardWidth: number
    rowGap: number
    marqueeSpeed: number
    pinDuration: number
    headingFontSize: number
    headingFont: any
    bodyFont: any
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
    {
        name: "Ava Martinez",
        company: "Northline Studio",
        quote: "They transformed our brand presence into something confident, premium, and conversion-focused.",
        avatarUrl: "https://i.pravatar.cc/180?img=12",
        avatar: { src: "https://i.pravatar.cc/180?img=12", alt: "Ava Martinez" },
    },
    {
        name: "Liam Chen",
        company: "Verity Labs",
        quote: "From strategy to execution, every detail felt deliberate. The result exceeded our expectations.",
        avatarUrl: "https://i.pravatar.cc/180?img=23",
        avatar: { src: "https://i.pravatar.cc/180?img=23", alt: "Liam Chen" },
    },
    {
        name: "Sophia Reed",
        company: "Motive Capital",
        quote: "The team delivered a portfolio experience that finally reflects the level of our work.",
        avatarUrl: "https://i.pravatar.cc/180?img=31",
        avatar: { src: "https://i.pravatar.cc/180?img=31", alt: "Sophia Reed" },
    },
    {
        name: "Noah Walker",
        company: "Cinder & Co.",
        quote: "Fast, precise, and deeply thoughtful design decisions throughout the full process.",
        avatarUrl: "https://i.pravatar.cc/180?img=42",
        avatar: { src: "https://i.pravatar.cc/180?img=42", alt: "Noah Walker" },
    },
    {
        name: "Mia Thompson",
        company: "Horizon Ventures",
        quote: "Our inquiries increased immediately after launch. The experience feels polished and modern.",
        avatarUrl: "https://i.pravatar.cc/180?img=54",
        avatar: { src: "https://i.pravatar.cc/180?img=54", alt: "Mia Thompson" },
    },
]

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
function StickyTestimonialsMarquee(props: MyComponentProps) {
    const {
        heading,
        testimonials,
        backgroundColor,
        cardBackground,
        borderColor,
        headingColor,
        textColor,
        mutedColor,
        radius,
        avatarSize,
        cardWidth,
        rowGap,
        marqueeSpeed,
        pinDuration,
        headingFontSize,
        headingFont,
        bodyFont,
    } = props

    const sectionRef = React.useRef<HTMLDivElement | null>(null)
    const pinRef = React.useRef<HTMLDivElement | null>(null)
    const rowRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const tweenRefs = React.useRef<gsap.core.Tween[]>([])
    const staticRenderer = useIsStaticRenderer()
    const inView = useInView(sectionRef, { amount: 0.2 })

    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined") return true
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }, [])

    const displayTestimonials = React.useMemo(() => {
        const source = testimonials?.length ? testimonials : DEFAULT_TESTIMONIALS
        return source.map((item, index) => ({
            ...item,
            avatarUrl: item.avatarUrl || item.avatar?.src || DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length].avatarUrl,
            avatar: item.avatar?.src || item.avatarUrl ? item.avatar : DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length].avatar,
        }))
    }, [testimonials])

    const headingFontStyles = React.useMemo(() => ({
        fontSize: headingFont?.fontSize || `${headingFontSize}px`,
        fontWeight: headingFont?.fontWeight || 700,
        fontFamily: headingFont?.fontFamily || "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: headingFont?.lineHeight || "1.05em",
        letterSpacing: headingFont?.letterSpacing || "-0.03em",
        fontStyle: headingFont?.fontStyle || "normal",
        textAlign: headingFont?.textAlign || "center",
    } as React.CSSProperties), [headingFont, headingFontSize])

    const bodyFontStyles = React.useMemo(() => ({
        fontSize: bodyFont?.fontSize || "15px",
        fontWeight: bodyFont?.fontWeight || 500,
        fontFamily: bodyFont?.fontFamily || "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: bodyFont?.lineHeight || "1.35em",
        letterSpacing: bodyFont?.letterSpacing || "-0.01em",
        fontStyle: bodyFont?.fontStyle || "normal",
    } as React.CSSProperties), [bodyFont])

    const rows = React.useMemo(() => [
        [...displayTestimonials],
        [...displayTestimonials].reverse(),
        [...displayTestimonials],
    ], [displayTestimonials])

    const getDuration = React.useCallback((distance: number) => 
        Math.max(10, distance / Math.max(30, marqueeSpeed)), 
    [marqueeSpeed])

    React.useEffect(() => {
        if (staticRenderer || prefersReducedMotion) return
        if (typeof window === "undefined") return
        if (!sectionRef.current || !pinRef.current) return

        gsap.registerPlugin(ScrollTrigger)
        tweenRefs.current.forEach(tween => tween.kill())
        tweenRefs.current = []

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${pinDuration}`,
                pin: pinRef.current, // Pin the INNER container instead of the outer section
                pinSpacing: true, // Keep the spacing
                scrub: false,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            })

            rowRefs.current.forEach((track, index) => {
                if (!track) return
                const singleSetWidth = track.scrollWidth / 2
                if (!singleSetWidth || !Number.isFinite(singleSetWidth)) return

                const leftToRight = index % 2 === 0
                const fromX = leftToRight ? -singleSetWidth : 0
                const toX = leftToRight ? 0 : -singleSetWidth

                gsap.set(track, { x: fromX, willChange: "transform", force3D: true })
                const tween = gsap.to(track, {
                    x: toX,
                    duration: getDuration(singleSetWidth),
                    ease: "none",
                    repeat: -1,
                    force3D: true,
                })
                tweenRefs.current.push(tween)
            })
        }, sectionRef)

        return () => {
            tweenRefs.current.forEach(tween => tween.kill())
            tweenRefs.current = []
            ctx.revert()
        }
    }, [getDuration, pinDuration, prefersReducedMotion, staticRenderer, rows])

    React.useEffect(() => {
        tweenRefs.current.forEach(tween => tween.paused(!inView))
    }, [inView])

    const isStatic = staticRenderer || prefersReducedMotion
    const renderedRows = isStatic ? rows.map(row => [...row]) : rows

    return (
        <section ref={sectionRef} style={{ position: "relative", width: "100%" }}>
            <div
                ref={pinRef}
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100vh", // Use 100vh for pinning to prevent layout collapse
                    minHeight: 540,
                    background: backgroundColor,
                    overflow: "hidden", // moved overflow hidden here
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    "--stm-card-bg": cardBackground,
                    "--stm-border": borderColor,
                    "--stm-heading": headingColor,
                    "--stm-text": textColor,
                    "--stm-muted": mutedColor,
                    "--stm-radius": `${radius}px`,
                    "--stm-avatar": `${avatarSize}px`,
                    "--stm-card-width": `${cardWidth}px`,
                    "--stm-row-gap": `${rowGap}px`,
                    "--stm-heading-size": `${headingFontSize}px`,
                } as React.CSSProperties}
            >
                <style>{`
                    .stm-shell { position: relative; width: 100%; display: flex; flex-direction: column; justify-content: center; gap: 42px; padding: clamp(28px, 4vw, 64px) 0; }
                    .stm-heading { margin: 0; text-align: center; color: var(--stm-heading); font-size: var(--stm-heading-size); line-height: 1.05; letter-spacing: -0.03em; padding: 0 20px; text-wrap: balance; }
                    .stm-rows { display: flex; flex-direction: column; gap: var(--stm-row-gap); padding: 6px 0; }
                    .stm-rowViewport { width: 100%; overflow: hidden; padding: 24px 0; margin: -21px 0; }
                    .stm-track { display: flex; width: max-content; gap: 18px; align-items: stretch; backface-visibility: hidden; transform: translateZ(0); }
                    .stm-card { width: min(var(--stm-card-width), calc(100vw - 32px)); min-height: 168px; border-radius: var(--stm-radius); border: 1px solid var(--stm-border); background: var(--stm-card-bg); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-sizing: border-box; padding: 18px; display: flex; flex-direction: column; gap: 14px; flex: 0 0 auto; transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease; backface-visibility: hidden; transform-style: preserve-3d; }
                    .stm-card:hover { transform: scale(1.05) translateZ(0); z-index: 10; position: relative; border-color: rgba(255,255,255,0.4); }
                    .stm-top { display: flex; align-items: center; gap: 12px; }
                    .stm-avatar { width: var(--stm-avatar); height: var(--stm-avatar); border-radius: 999px; object-fit: cover; border: 1px solid var(--stm-border); flex: 0 0 auto; }
                    .stm-name { margin: 0; color: var(--stm-text); }
                    .stm-company { margin: 2px 0 0; color: var(--stm-muted); }
                    .stm-quote { margin: 0; color: var(--stm-text); }
                    @media (max-width: 1024px) {
                        .stm-shell { gap: 32px; padding: clamp(24px, 3vw, 40px) 0; }
                        .stm-heading { font-size: clamp(36px, 6vw, var(--stm-heading-size)); }
                        .stm-card { width: min(320px, calc(100vw - 32px)); min-height: 160px; padding: 16px; }
                    }
                    @media (max-width: 809px) {
                        .stm-shell { gap: 24px; justify-content: flex-start; padding: 20px 0; }
                        .stm-heading { font-size: clamp(28px, 8vw, 48px); }
                        .stm-track { gap: 14px; }
                        .stm-card { width: min(280px, calc(100vw - 32px)); min-height: 140px; padding: 14px; gap: 10px; }
                        .stm-avatar { width: calc(var(--stm-avatar) * 0.8); height: calc(var(--stm-avatar) * 0.8); }
                    }
                    .stm-static .stm-rowViewport { overflow: visible; }
                    .stm-static .stm-track { width: 100%; transform: none !important; flex-wrap: nowrap; }
                    .stm-static .stm-card { width: min(var(--stm-card-width), calc(100vw - 32px)); }
                    @media (max-width: 809px) {
                        .stm-static .stm-track { overflow-x: auto; padding: 0 16px; scrollbar-width: none; }
                        .stm-static .stm-track::-webkit-scrollbar { display: none; }
                    }
                `}</style>

                <div className={`stm-shell ${isStatic ? "stm-static" : ""}`} aria-label="Client testimonials marquee section">
                    <h2 className="stm-heading" style={headingFontStyles}>{heading}</h2>

                    <div className="stm-rows">
                        {renderedRows.map((rowItems, rowIndex) => (
                            <div className="stm-rowViewport" key={`row-${rowIndex}`}>
                                <div className="stm-track" ref={node => { rowRefs.current[rowIndex] = node }}>
                                    {(isStatic ? rowItems : [...rowItems, ...rowItems]).map((item, index) => (
                                        <article className="stm-card" key={`${rowIndex}-${index}`}>
                                            <div className="stm-top">
                                                {(() => {
                                                    const fallback = DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length].avatarUrl || "https://i.pravatar.cc/180?img=12"
                                                    const avatarSrc = item.avatar?.src || item.avatarUrl || fallback
                                                    return <img className="stm-avatar" src={avatarSrc} srcSet={item.avatar?.srcSet} alt={item.avatar?.alt || `${item.name} avatar`} />
                                                })()}
                                                <div>
                                                    <p className="stm-name" style={{ ...bodyFontStyles, textAlign: "left" }}>{item.name}</p>
                                                    <p className="stm-company" style={{ ...bodyFontStyles, textAlign: "left", opacity: 0.9 }}>{item.company}</p>
                                                </div>
                                            </div>
                                            <p className="stm-quote" style={{ ...bodyFontStyles, textAlign: "left" }}>{item.quote}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}





export interface FAQItem {
    question: string
    answer: string
}

export interface FaqMonochromeProps {
    heading: string
    items: FAQItem[]
    theme: "Dark" | "Light"
    padding: number
    maxWidth: number
    questionFont: any
    answerFont: any
}

function FaqMonochrome(props: FaqMonochromeProps) {
    const { heading, items, theme, padding, maxWidth, questionFont, answerFont } = props
    
    const [openIndex, setOpenIndex] = React.useState<number | null>(0)

    const isDark = theme === "Dark"
    const bg = isDark ? "#0A0A0A" : "#FFFFFF"
    const fg = isDark ? "#FFFFFF" : "#0A0A0A"
    const muted = isDark ? "#A3A3A3" : "#525252"
    const border = isDark ? "#262626" : "#E5E5E5"

    const questionStyle = {
        fontSize: questionFont?.fontSize || "24px",
        fontWeight: questionFont?.fontWeight || 500,
        fontFamily: questionFont?.fontFamily || "Inter, -apple-system, sans-serif",
        letterSpacing: questionFont?.letterSpacing || "-0.02em",
        color: fg,
        margin: 0,
    }

    const answerStyle = {
        fontSize: answerFont?.fontSize || "16px",
        fontWeight: answerFont?.fontWeight || 400,
        fontFamily: answerFont?.fontFamily || "Inter, -apple-system, sans-serif",
        lineHeight: answerFont?.lineHeight || "1.6em",
        color: muted,
        margin: 0,
    }

    return (
        <section 
            style={{ 
                background: bg, 
                width: "100%", 
                padding: `${padding}px 24px`, 
                display: "flex", 
                justifyContent: "center",
                transition: "background 0.3s ease"
            }}
        >
            <div style={{ width: "100%", maxWidth: maxWidth, display: "flex", flexDirection: "column", gap: 48 }}>
                {heading && (
                    <h2 
                        style={{ 
                            ...questionStyle, 
                            fontSize: "clamp(36px, 5vw, 56px)", 
                            fontWeight: 500, 
                            letterSpacing: "-0.03em" 
                        }}
                    >
                        {heading}
                    </h2>
                )}
                
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {(items || []).map((item, i) => {
                        const isOpen = openIndex === i
                        
                        return (
                            <div 
                                key={i} 
                                style={{ 
                                    borderBottom: `1px solid ${border}`, 
                                    overflow: "hidden" 
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "32px 0",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        gap: 24,
                                        outline: "none"
                                    }}
                                >
                                    <h3 
                                        style={{
                                            ...questionStyle,
                                            transition: "color 0.2s ease",
                                            opacity: isOpen ? 1 : 0.85
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = isOpen ? "1" : "0.85"}
                                    >
                                        {item.question}
                                    </h3>
                                    
                                    <motion.div 
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ 
                                            width: 24, 
                                            height: 24, 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            flexShrink: 0, 
                                            color: fg,
                                            opacity: isOpen ? 1 : 0.6
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </motion.div>
                                </button>
                                
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div style={{ paddingBottom: 40, paddingRight: "clamp(24px, 10vw, 80px)" }}>
                                                <p style={answerStyle}>{item.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

const DEFAULT_ITEMS = [
    { 
        question: "How does the pricing work?", 
        answer: "We offer a single, straightforward tier. You pay once and get lifetime access to all components, updates, and community features. No recurring subscriptions or hidden fees." 
    },
    { 
        question: "Can I use these for commercial projects?", 
        answer: "Absolutely. All components are licensed for commercial use. You can use them in your own projects or client work without attribution. We designed them to be dropped directly into production apps." 
    },
    { 
        question: "Do you offer technical support?", 
        answer: "Yes, we provide dedicated email support for all users. We also have a comprehensive documentation hub, video tutorials, and an active community forum where developers help each other." 
    },
    { 
        question: "How often are new components added?", 
        answer: "We release new component packs bi-weekly. As a lifetime member, you'll automatically get access to all future releases at no extra cost, keeping your toolkit constantly updated." 
    }
]





export interface AnimaFooterProps {
    prefix?: string
    suffix?: string
    ringColor?: string
    backgroundColor?: string
    textColor?: string
    linkedinUrl?: string
    instagramUrl?: string
    xUrl?: string
}

function AnimaFooter(props: AnimaFooterProps) {
    const {
        prefix = "Ed",
        suffix = "tor",
        ringColor = "#0055FF",
        backgroundColor = "#FFFFFF",
        textColor = "#0A0A0A",
        linkedinUrl = "#",
        instagramUrl = "#",
        xUrl = "#"
    } = props

    const containerRef = React.useRef<HTMLDivElement>(null)
    const blueRef = React.useRef<HTMLDivElement>(null)
    const whiteRef = React.useRef<HTMLDivElement>(null)
    const prefixRef = React.useRef<HTMLSpanElement>(null)
    const suffixRef = React.useRef<HTMLSpanElement>(null)

    React.useEffect(() => {
        if (typeof window === "undefined") return
        if (!containerRef.current || !blueRef.current || !whiteRef.current) return

        gsap.registerPlugin(ScrollTrigger)

        // Spring physics state
        let targetProgress = 1
        let currentProgress = 1
        let velocity = 0
        let rafId: number

        const updateCircles = (p: number) => {
            const pc = Math.max(0, Math.min(1.05, p))

            // White: 2vw (dot) → 150vw
            const whiteVW = 2 + 148 * pc
            const blueVW = Math.max(2, 3 * whiteVW - 2)

            if (blueRef.current) {
                blueRef.current.style.width = `${blueVW}vw`
                blueRef.current.style.height = `${blueVW}vw`
            }
            if (whiteRef.current) {
                whiteRef.current.style.width = `${whiteVW}vw`
                whiteRef.current.style.height = `${whiteVW}vw`
            }

            // Text animation:
            // Text VISIBLE when circles small (pc=0)
            // Text HIDDEN when circles big (pc=1)
            const textOpacity = Math.max(0, Math.min(1, 1 - pc * 2.5))
            // slides down as circles grow, up as they shrink
            const translateY = pc * 25

            if (prefixRef.current) {
                prefixRef.current.style.opacity = `${textOpacity}`
                prefixRef.current.style.transform = `translateY(${translateY}px)`
            }
            if (suffixRef.current) {
                suffixRef.current.style.opacity = `${textOpacity}`
                suffixRef.current.style.transform = `translateY(${translateY}px)`
            }
        }

        // Spring physics loop — runs every frame
        const springLoop = () => {
            // Spring constants:
            // stiffness: how fast it chases target (higher = snappier)
            // damping: how much it bounces (lower = more bounce, like paper in wind)
            const stiffness = 0.07
            const damping = 0.70  // underdamped → slight overshoot on stop = paper effect

            const force = (targetProgress - currentProgress) * stiffness
            velocity = velocity * damping + force
            currentProgress += velocity

            updateCircles(currentProgress)
            rafId = requestAnimationFrame(springLoop)
        }

        // ScrollTrigger: pins section and tracks scroll progress
        // No scrub — we handle animation ourselves with spring
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=400",
            pin: true,
            onUpdate: (self) => {
                targetProgress = 1 - self.progress  // invert: scroll down = big→small
            }
        })

        // Start spring loop
        rafId = requestAnimationFrame(springLoop)

        return () => {
            st.kill()
            cancelAnimationFrame(rafId)
        }
    }, [ringColor])

    return (
        <section
            ref={containerRef}
            style={{
                height: "100vh",
                background: backgroundColor,
                color: textColor,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontFamily: "Inter, -apple-system, sans-serif"
            }}
        >
            {/* Footer Content — low zIndex so circles cover them */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "max(5vw, 40px) 8vw",

                zIndex: 2,
                position: "relative",
                flexWrap: "wrap",
                gap: "40px"
            }}>
                {/* Left: Brand */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "340px" }}>
                    {/* Logo / Name */}
                    <div style={{ fontSize: "28px", fontWeight: 700, color: textColor, letterSpacing: "-0.02em" }}>
                        Anky M
                    </div>
                    {/* Tagline */}
                    <div style={{ fontSize: "14px", color: "#666", lineHeight: 1.5 }}>
                        I craft raw footage into captivating visual artistry&nbsp;
                        <span style={{ display: "inline-block", fontSize: "12px" }}>↗</span>
                    </div>
                    {/* Let's connect */}
                    <div style={{ fontSize: "13px", fontWeight: 700, color: textColor, marginTop: "4px" }}>
                        Let's connect!
                    </div>
                    {/* Social Icons */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
                        {/* LinkedIn */}
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
                            width: "32px", height: "32px", borderRadius: "6px",
                            background: ringColor, display: "flex", alignItems: "center",
                            justifyContent: "center", textDecoration: "none"
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{
                            width: "32px", height: "32px", borderRadius: "6px",
                            background: ringColor, display: "flex", alignItems: "center",
                            justifyContent: "center", textDecoration: "none"
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                        {/* X (Twitter) */}
                        <a href={xUrl} target="_blank" rel="noopener noreferrer" style={{
                            width: "32px", height: "32px", borderRadius: "6px",
                            background: ringColor, display: "flex", alignItems: "center",
                            justifyContent: "center", textDecoration: "none"
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Right: Navigation */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: textColor, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Section
                    </div>
                    {["Work", "Services", "Testimonial", "Pricing", "FAQ"].map((item) => (
                        <a key={item} href="#" style={{
                            fontSize: "15px", color: "#666", textDecoration: "none",
                            transition: "color 0.2s"
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = textColor)}
                            onMouseLeave={e => (e.currentTarget.style.color = "#666")}
                        >{item}</a>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 8vw",
                borderTop: `1px solid ${textColor === "#0A0A0A" ? "#e5e5e5" : "#222"}`,
                zIndex: 2,
                position: "relative"
            }}>
                <span style={{ fontSize: "13px", color: "#888" }}>© 2025. All rights reserved</span>
                <span style={{ fontSize: "13px", color: "#888" }}>@ankyym</span>
            </div>

            {/* Bottom Giant Text — pushed down so the bottom is clipped by the section */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                fontSize: "clamp(60px, 22vw, 380px)",
                fontWeight: 800,
                fontFamily: "Helvetica, Arial, sans-serif",
                letterSpacing: "-0.04em",
                lineHeight: 0.72,
                position: "relative",
                zIndex: 2,
                pointerEvents: "none",
                transform: "translateY(28%)" /* push down to cut off the bottom */
            }}>
                <span ref={prefixRef} style={{
                    color: textColor,
                    opacity: 1,
                    transform: 'translateY(0px)',
                    display: 'inline-block'
                }}>{prefix}</span>

                {/* The 'i' — circles anchored here */}
                <div style={{
                    position: "relative",
                    width: "0.16em",
                    height: "0.72em",
                    margin: "0 0.02em"
                }}>
                    {/* i stem */}
                    <div style={{
                        position: "absolute", bottom: 0, left: "50%",
                        transform: "translateX(-50%)",
                        width: "0.13em", height: "0.5em",
                        background: textColor,
                        zIndex: 2,
                        borderRadius: "0.015em 0.015em 0 0"
                    }} />

                    {/* BLUE SOLID CIRCLE — outermost, grows fastest */}
                    <div ref={blueRef} style={{
                        position: "absolute",
                        top: "0.08em",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "2vw",
                        height: "2vw",
                        borderRadius: "50%",
                        background: ringColor,
                        zIndex: 10,
                        willChange: "width, height"
                    }} />

                    {/* WHITE SOLID CIRCLE — inner, grows slower */}
                    <div ref={whiteRef} style={{
                        position: "absolute",
                        top: "0.08em",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "2vw",
                        height: "2vw",
                        borderRadius: "50%",
                        background: "#000000",
                        zIndex: 11,
                        willChange: "width, height"
                    }} />

                    {/* i dot — always on top */}
                    <div style={{
                        position: "absolute",
                        top: "0.08em",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "0.14em", height: "0.14em",
                        borderRadius: "50%",
                        background: textColor,
                        zIndex: 20
                    }} />
                </div>

                <span ref={suffixRef} style={{
                    color: textColor,
                    opacity: 1,
                    transform: 'translateY(0px)',
                    display: 'inline-block'
                }}>{suffix}</span>
            </div>
        </section>
    )
}




export default function CombinedSection(props: any) {
    return (
        <div style={{ width: "100%", backgroundColor: props.pageBackgroundColor || "#000" }}>
            <StickyTestimonialsMarquee 
                heading={props.test_heading}
                testimonials={props.testimonials}
                backgroundColor={props.test_backgroundColor}
                cardBackground={props.test_cardBackground}
                borderColor={props.test_borderColor}
                headingColor={props.test_headingColor}
                textColor={props.test_textColor}
                mutedColor={props.test_mutedColor}
                radius={props.test_radius}
                avatarSize={props.test_avatarSize}
                cardWidth={props.test_cardWidth}
                rowGap={props.test_rowGap}
                marqueeSpeed={props.test_marqueeSpeed}
                pinDuration={props.test_pinDuration}
                headingFontSize={props.test_headingFontSize}
            />
            <FaqMonochrome 
                theme={props.faq_theme}
                heading={props.faq_heading}
                items={props.faq_items}
            />
            <AnimaFooter 
                prefix={props.foot_prefix}
                suffix={props.foot_suffix}
                ringColor={props.foot_ringColor}
                backgroundColor={props.foot_backgroundColor}
                textColor={props.foot_textColor}
                linkedinUrl={props.foot_linkedinUrl}
                instagramUrl={props.foot_instagramUrl}
                xUrl={props.foot_xUrl}
            />
        </div>
    )
}



addPropertyControls(CombinedSection, {
    pageBackgroundColor: { type: ControlType.Color, title: "Page BG", defaultValue: "#000000" },
    
    test_heading: { type: ControlType.String, title: "Test. Heading", defaultValue: "What Clients Are Saying" },
    testimonials: {
        type: ControlType.Array, title: "Testimonials",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, defaultValue: "Ava Martinez" },
                company: { type: ControlType.String, defaultValue: "Northline Studio" },
                quote: { type: ControlType.String, defaultValue: "Great work!", displayTextArea: true },
                avatarUrl: { type: ControlType.String, defaultValue: "https://i.pravatar.cc/180?img=12" },
                avatar: { type: ControlType.ResponsiveImage },
            },
        },
    },
    test_backgroundColor: { type: ControlType.Color, title: "Test. BG", defaultValue: "#0A0A0A" },
    test_cardBackground: { type: ControlType.Color, title: "Card BG", defaultValue: "rgba(255,255,255,0.08)" },
    test_borderColor: { type: ControlType.Color, title: "Card Border", defaultValue: "rgba(255,255,255,0.24)" },
    test_headingColor: { type: ControlType.Color, title: "Test. Heading Col", defaultValue: "#FFFFFF" },
    test_textColor: { type: ControlType.Color, title: "Test. Text", defaultValue: "#F2F2F2" },
    test_mutedColor: { type: ControlType.Color, title: "Test. Muted", defaultValue: "#C8C8C8" },
    test_radius: { type: ControlType.Number, title: "Card Radius", defaultValue: 30 },
    test_avatarSize: { type: ControlType.Number, title: "Avatar Size", defaultValue: 64 },
    test_cardWidth: { type: ControlType.Number, title: "Card Width", defaultValue: 380 },
    test_rowGap: { type: ControlType.Number, title: "Row Gap", defaultValue: 22 },
    test_marqueeSpeed: { type: ControlType.Number, title: "Marquee Speed", defaultValue: 75 },
    test_pinDuration: { type: ControlType.Number, title: "Pin Duration", defaultValue: 500 },
    test_headingFontSize: { type: ControlType.Number, title: "Test. Head Size", defaultValue: 64 },

    faq_theme: { type: ControlType.Enum, options: ["Dark", "Light"], defaultValue: "Dark", title: "FAQ Theme" },
    faq_heading: { type: ControlType.String, defaultValue: "Frequently Asked", title: "FAQ Heading" },
    faq_items: {
        type: ControlType.Array, title: "FAQ Questions",
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, defaultValue: "New Question?" },
                answer: { type: ControlType.String, displayTextArea: true, defaultValue: "Detailed answer." }
            }
        }
    },

    foot_prefix: { type: ControlType.String, title: "Footer Left", defaultValue: "Ed" },
    foot_suffix: { type: ControlType.String, title: "Footer Right", defaultValue: "tor" },
    foot_ringColor: { type: ControlType.Color, title: "Ring Color", defaultValue: "#0055FF" },
    foot_backgroundColor: { type: ControlType.Color, title: "Footer BG", defaultValue: "#FFFFFF" },
    foot_textColor: { type: ControlType.Color, title: "Footer Text Col", defaultValue: "#0A0A0A" },
    foot_linkedinUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "https://linkedin.com" },
    foot_instagramUrl: { type: ControlType.String, title: "Instagram URL", defaultValue: "https://instagram.com" },
    foot_xUrl: { type: ControlType.String, title: "X URL", defaultValue: "https://x.com" }
});
