import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Mock framer imports
const addPropertyControls = (component: any, controls: any) => {};
const ControlType = { String: "String", Color: "Color" };

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

export default function AnimaFooter(props: AnimaFooterProps) {
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

addPropertyControls(AnimaFooter, {
    prefix: { type: ControlType.String, title: "Text Left", defaultValue: "Ed" },
    suffix: { type: ControlType.String, title: "Text Right", defaultValue: "tor" },
    ringColor: { type: ControlType.Color, title: "Ring Color", defaultValue: "#0055FF" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#FFFFFF" },
    textColor: { type: ControlType.Color, title: "Text Color", defaultValue: "#0A0A0A" },
    linkedinUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "https://linkedin.com" },
    instagramUrl: { type: ControlType.String, title: "Instagram URL", defaultValue: "https://instagram.com" },
    xUrl: { type: ControlType.String, title: "X URL", defaultValue: "https://x.com" }
})
