import * as React from "react"
// Mock framer imports for local testing outside of Framer
const addPropertyControls = (component: any, controls: any) => {};
const ControlType = { String: "String", Array: "Array", Object: "Object", ResponsiveImage: "ResponsiveImage", Color: "Color", Number: "Number", Font: "Font" };
const useIsStaticRenderer = () => false;

import { useInView } from "framer-motion"
import gsap from "gsap"
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
export default function StickyTestimonialsMarquee(props: MyComponentProps) {
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

addPropertyControls(StickyTestimonialsMarquee, {
    heading: { type: ControlType.String, title: "Heading", defaultValue: "What Clients Are Saying" },
    testimonials: {
        type: ControlType.Array, title: "Testimonials", defaultValue: DEFAULT_TESTIMONIALS,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, defaultValue: "Ava Martinez" },
                company: { type: ControlType.String, defaultValue: "Northline Studio" },
                quote: { type: ControlType.String, defaultValue: "They transformed our brand presence into something confident, premium, and conversion-focused.", displayTextArea: true },
                avatarUrl: { type: ControlType.String, defaultValue: "https://i.pravatar.cc/180?img=12" },
                avatar: { type: ControlType.ResponsiveImage },
            },
        },
    },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#0A0A0A" },
    cardBackground: { type: ControlType.Color, title: "Card BG", defaultValue: "rgba(255,255,255,0.08)" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "rgba(255,255,255,0.24)" },
    headingColor: { type: ControlType.Color, title: "Heading", defaultValue: "#FFFFFF" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#F2F2F2" },
    mutedColor: { type: ControlType.Color, title: "Muted", defaultValue: "#C8C8C8" },
    radius: { type: ControlType.Number, title: "Radius", defaultValue: 30, min: 12, max: 48, step: 1 },
    avatarSize: { type: ControlType.Number, title: "Avatar", defaultValue: 64, min: 56, max: 72, step: 1 },
    cardWidth: { type: ControlType.Number, title: "Card Width", defaultValue: 380, min: 240, max: 520, step: 1 },
    rowGap: { type: ControlType.Number, title: "Row Gap", defaultValue: 22, min: 8, max: 60, step: 1 },
    marqueeSpeed: { type: ControlType.Number, title: "Speed", defaultValue: 75, min: 20, max: 220, step: 1 },
    pinDuration: { type: ControlType.Number, title: "Pin Distance", defaultValue: 500, min: 0, max: 4000, step: 10 },
    headingFontSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 64, min: 24, max: 120, step: 1 },
    headingFont: { type: ControlType.Font, title: "Heading Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "64px", variant: "Bold", letterSpacing: "-0.03em", lineHeight: "1.05em", textAlign: "center" } },
    bodyFont: { type: ControlType.Font, title: "Body Font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontSize: "15px", variant: "Medium", letterSpacing: "-0.01em", lineHeight: "1.35em", textAlign: "left" } },
})
