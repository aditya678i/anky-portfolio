import * as React from "react"
import { useRef, useEffect } from "react"
import "./ServicesScroll.css"
import { addPropertyControls, ControlType } from "framer"

export default function ServicesScroll(props) {
    const containerRef = useRef(null)

    const mainTitle = props.mainTitle || "SERVICES"
    const backgroundColor = props.backgroundColor || "#e6e9ee" // <-- Added this
    const rawServices = props.services
    const services =
        rawServices && rawServices.length > 0
            ? rawServices
            : [
                  {
                      title: "3D MODELING",
                      description:
                          "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
                  },
                  {
                      title: "3D RENDERING",
                      description:
                          "High-quality, photorealistic renders that showcase designs with realistic lighting, textures, and shadows.",
                  },
                  {
                      title: "3D ANIMATION",
                      description:
                          "Dynamic animations to bring characters, products, or environments to life for marketing, gaming, or storytelling.",
                  },
                  {
                      title: "PRODUCT DESIGN",
                      description:
                          "Precise 3D modeling and rendering for showcasing or prototyping consumer products.",
                  },
                  {
                      title: "3D PRINTING READY",
                      description:
                          "Custom 3D designs prepared and optimized for 3D printing technology.",
                  },
              ]

    useEffect(() => {
        if (typeof window === "undefined") return
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
        if (reducedMotion) return

        let ctx;
        let isReverted = false;

        Promise.all([
            import("https://esm.sh/gsap"),
            import("https://esm.sh/gsap/ScrollTrigger"),
        ]).then(([{ default: gsap }, { default: ScrollTrigger }]) => {
            if (isReverted) return;
            gsap.registerPlugin(ScrollTrigger)

            ctx = gsap.context(() => {
                const titleFill = containerRef.current?.querySelector(
                    ".services-title-fill"
                )
                const titleOutline = containerRef.current?.querySelector(
                    ".services-title-outline"
                )

                if (titleFill) {
                    gsap.set(titleFill, {
                        opacity: 1,
                        clipPath: "inset(0% 100% 0% 0%)",
                    })
                }
                if (titleOutline) {
                    gsap.set(titleOutline, { opacity: 1 })
                }

                gsap.to(titleFill, {
                    clipPath: "inset(0% -5% 0% -5%)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".hero-section",
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        pin: true,
                    },
                })

                const serviceItems = gsap.utils.toArray(".service-item")
                serviceItems.forEach((item) => {
                    const numberFill = item.querySelector(".number-fill")
                    const numberOutline = item.querySelector(".number-outline")
                    const dotFill = item.querySelector(".dot-fill")
                    const dotOutline = item.querySelector(".dot-outline")
                    const heading = item.querySelector(".service-title")
                    const desc = item.querySelector(".service-desc")
                    const content = item.querySelector(".service-content")

                    if (numberFill)
                        gsap.set(numberFill, {
                            opacity: 1,
                            clipPath: "inset(100% 0% 0% 0%)",
                        })
                    if (numberOutline) gsap.set(numberOutline, { opacity: 1 })
                    if (dotFill)
                        gsap.set(dotFill, {
                            opacity: 1,
                            clipPath: "inset(100% 0% 0% 0%)",
                        })
                    if (dotOutline) gsap.set(dotOutline, { opacity: 1 })

                    if (content)
                        gsap.set(content, { opacity: 1, y: 0, transform: "none" })
                    if (heading) gsap.set(heading, { opacity: 0, y: 30 })
                    if (desc) gsap.set(desc, { opacity: 0, y: 30 })

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            start: "top 70%",
                            end: "top 30%",
                            scrub: 1,
                        },
                    })

                    tl.to(
                        numberFill,
                        {
                            clipPath: "inset(-5% -5% -5% -5%)",
                            ease: "none",
                            duration: 1,
                        },
                        0
                    )
                    tl.to(
                        dotFill,
                        {
                            clipPath: "inset(-5% -5% -5% -5%)",
                            ease: "none",
                            duration: 1,
                        },
                        0
                    )
                    tl.to(
                        heading,
                        { opacity: 1, y: 0, ease: "none", duration: 1 },
                        0
                    )
                    tl.to(
                        desc,
                        { opacity: 1, y: 0, ease: "power2.out", duration: 1 },
                        0
                    )
                })
            }, containerRef)
        })

        return () => {
            isReverted = true;
            if (ctx) {
                ctx.revert()
            }
        }
    }, [services.length])

    return (
        <div
            ref={containerRef}
            id="services-container"
            style={{
                ...styles.container,
                backgroundColor: backgroundColor,
            }}
        >
            

            <div
                ref={containerRef}
                style={{
                    ...styles.container,
                    backgroundColor: backgroundColor,
                }}
            >
                <section className="hero-section" style={styles.heroSection}>
                    <div
                        className="services-title-wrap"
                        style={styles.hugeText}
                    >
                        <div className="services-title-outline">
                            {mainTitle}
                        </div>
                        <div
                            className="services-title-fill"
                            style={styles.titleFillLayer}
                        >
                            {mainTitle}
                        </div>
                    </div>
                </section>

                <section style={styles.servicesListSection}>
                    {services.map((service, index) => {
                        const formattedIndex = (index + 1)
                            .toString()
                            .padStart(2, "0")
                        return (
                            <div
                                key={index}
                                className="service-item"
                                style={styles.serviceItem}
                            >
                                <div className="number-group">
                                    <div className="number-wrap" style={styles.serviceNumber}>
                                        <span className="number-outline">{formattedIndex}</span>
                                        <span className="number-fill">{formattedIndex}</span>
                                    </div>
                                    <div className="dot-wrap">
                                        <span className="dot-outline">■</span>
                                        <span className="dot-fill">■</span>
                                    </div>
                                </div>
                                <div
                                    className="service-content"
                                    style={styles.serviceContent}
                                >
                                    <h2
                                        className="service-title"
                                        style={styles.serviceTitle}
                                    >
                                        {service.title}
                                    </h2>
                                    <p
                                        className="service-desc"
                                        style={styles.serviceDesc}
                                    >
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </section>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// Framer Property Controls
// ----------------------------------------------------------------------
addPropertyControls(ServicesScroll, {
    backgroundColor: {
        // <-- Added background color control
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#e6e9ee",
    },
    mainTitle: {
        type: ControlType.String,
        title: "Main Title",
        defaultValue: "SERVICES",
    },
    services: {
        type: ControlType.Array,
        title: "Services List",
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "3D MODELING",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Creation of detailed objects...",
                },
            },
        },
    },
})

const styles = {
    container: {
        width: "100%",
        // backgroundColor is now controlled via props
        color: "#111",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
    },
    heroSection: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    hugeText: {
        fontSize: "15vw",
        fontWeight: 900,
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: "0.02em",
        margin: 0,
        lineHeight: 1,
        whiteSpace: "nowrap",
    },
    servicesListSection: {
        padding: "0 clamp(16px, 5vw, 60px)",
        maxWidth: "1200px",
        margin: "-15vh auto 0 auto",
        paddingBottom: "10vh",
        position: "relative",
        zIndex: 10,
    },
    serviceItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "4rem",
        marginBottom: "20vh",
        position: "relative",
    },
    serviceNumber: {
        fontSize: "10vw",
        fontWeight: 900,
        fontFamily: "'Montserrat', sans-serif",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        margin: 0,
    },
    fillLayer: { fontWeight: 900, backgroundPosition: "0% 0%" },
    titleFillLayer: {
        fontWeight: 900,
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: "0.02em",
        lineHeight: 1,
    },
    serviceContent: { paddingTop: "0" },
    serviceTitle: {
        fontSize: "clamp(18px, 3vw, 2.5rem)",
        fontWeight: 900,
        fontFamily: "'Montserrat', sans-serif",
        color: "#111",
        letterSpacing: "0.02em",
        margin: 0,
        textTransform: "uppercase",
        lineHeight: 1,
        marginTop: "0.2em",
    },
    serviceDesc: {
        fontSize: "clamp(14px, 1.5vw, 1.125rem)",
        color: "#555",
        lineHeight: 1.6,
        maxWidth: "600px",
        fontWeight: 500,
        margin: 0,
        marginTop: "1rem",
    },
}

