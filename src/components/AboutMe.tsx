import * as React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// ----------------------------------------------------
// Tool Card Component
// ----------------------------------------------------
const ToolCard = ({ iconUrl, link, iconPadding = 18 }) => {
    const [isHovered, setIsHovered] = useState(false)

    const content = (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            style={{
                background: "rgba(22, 22, 22, 0.85)",
                backdropFilter: "blur(12px)",
                border:
                    "1px solid " +
                    (isHovered
                        ? "rgba(255,107,0,0.25)"
                        : "rgba(255,255,255,0.08)"),
                borderRadius: "14px",
                padding: iconPadding + "px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: isHovered
                    ? "0 16px 40px -8px rgba(255,107,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)"
                    : "0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                transition: "border 0.3s, box-shadow 0.3s",
                flexShrink: 0,
                width: "68px",
                height: "68px",
                boxSizing: "border-box",
            }}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ x: "-120%", opacity: 0 }}
                        animate={{ x: "200%", opacity: 0.45 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "50%",
                            height: "100%",
                            background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                            transform: "skewX(-20deg)",
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                )}
            </AnimatePresence>
            <div
                style={{
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt="Tool icon"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                        }}
                    />
                )}
            </div>
        </motion.div>
    )

    if (link) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
            >
                {content}
            </a>
        )
    }
    return content
}

// ----------------------------------------------------
// Main AboutMe Component
// ----------------------------------------------------
export default function AboutMe(props) {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" })

    const {
        backgroundColor = "#000000",
        textColor = "#ffffff",
        accentColor = "#FF6B00",
        profileImage,
        greeting = "Hi, I'm Anky.",
        paragraph1 = "A second-year student at USDI, GGSIPU.",
        paragraph2 = "I am a full-time freelance designer focused on creating modern digital experiences.",
        paragraph3 = "Passionate about branding, UI/UX, and visual storytelling.",
        buttons = [],
    } = props

    return (
        <section
            ref={sectionRef}
            style={{
                backgroundColor: backgroundColor,
                color: textColor,
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    maxWidth: "1300px",
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "clamp(260px, 28vw, 380px) 1fr auto",
                    gridTemplateRows: "1fr",
                    gap: "clamp(24px, 4vw, 60px)",
                    alignItems: "stretch",
                }}
                className="about-grid"
            >
                {/* LEFT: Profile Image */}
                <motion.div
                    className="about-image"
                    initial={{ opacity: 0, x: -40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                        minHeight: "480px",
                        background: profileImage
                            ? "url(" + profileImage + ") center/cover no-repeat"
                            : "linear-gradient(145deg, #0d0d0d, #050505)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                    }}
                >
                    {!profileImage && (
                        <span
                            style={{
                                color: "rgba(255,255,255,0.12)",
                                fontSize: "11px",
                                letterSpacing: "4px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                            }}
                        >
                            Your Photo
                        </span>
                    )}
                    <div
                        style={{
                            position: "absolute",
                            top: 18,
                            left: 18,
                            width: 10,
                            height: 10,
                            borderTop: "2px solid " + accentColor,
                            borderLeft: "2px solid " + accentColor,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 18,
                            right: 18,
                            width: 10,
                            height: 10,
                            borderBottom: "2px solid " + accentColor,
                            borderRight: "2px solid " + accentColor,
                        }}
                    />
                </motion.div>

                {/* CENTER: Intro Text + Buttons Row */}
                <motion.div
                    className="about-text-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.8,
                        delay: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "48px",
                    }}
                >
                    {/* Intro Text */}
                    <div
                        style={{
                            fontSize: "clamp(17px, 1.6vw, 21px)",
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 400,
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {greeting && (
                            <p
                                style={{
                                    margin: 0,
                                    color: textColor,
                                    fontWeight: 600,
                                    fontSize: "clamp(18px, 1.8vw, 24px)",
                                }}
                            >
                                {greeting}
                            </p>
                        )}
                        {paragraph1 && (
                            <p style={{ margin: 0 }}>{paragraph1}</p>
                        )}
                        {paragraph2 && (
                            <p style={{ margin: 0 }}>{paragraph2}</p>
                        )}
                        {paragraph3 && (
                            <p style={{ margin: 0 }}>{paragraph3}</p>
                        )}
                    </div>

                    {/* Tool Buttons Array */}
                    <div
                        className="about-buttons"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Custom Buttons Added via Framer Controls */}
                        {buttons &&
                            buttons.map((btn, idx) => (
                                <ToolCard
                                    key={"custom-" + idx}
                                    iconUrl={btn.icon}
                                    link={btn.link}
                                    iconPadding={btn.iconPadding}
                                />
                            ))}
                    </div>
                </motion.div>

                {/* RIGHT: Vertical "ABOUT ME" Typography */}
                <motion.div
                    className="about-vertical-wrapper"
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                        duration: 0.9,
                        delay: 0.25,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    <div
                        className="about-vertical-text"
                        style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "0.1em",
                            lineHeight: 0.85,
                            letterSpacing: "-0.02em",
                            fontWeight: 900,
                            textTransform: "uppercase",
                        }}
                    >
                        <span
                            className="about-span-white"
                            style={{
                                color: textColor,
                                fontSize: "clamp(60px, 7vw, 96px)",
                                fontFamily:
                                    "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                        >
                            ABOUT
                        </span>
                        <span
                            className="about-span-color"
                            style={{
                                color: accentColor,
                                fontSize: "clamp(60px, 7vw, 96px)",
                                fontFamily:
                                    "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                        >
                            ME
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Responsive Styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        /* Tablet: collapse image column, keep vertical text on side of image */
                        "@media (max-width: 1024px) {" +
                        "  .about-grid { grid-template-columns: 1fr clamp(50px,8vw,70px) !important; grid-template-rows: auto auto !important; gap: clamp(20px,3vw,32px) clamp(10px,2vw,16px) !important; }" +
                        "  .about-image { grid-column: 1 !important; grid-row: 1 !important; width: 100% !important; max-width: clamp(220px,50vw,320px) !important; min-height: clamp(220px,50vw,320px) !important; margin: 0 auto !important; }" +
                        "  .about-vertical-wrapper { display: flex !important; grid-column: 2 !important; grid-row: 1 !important; width: auto !important; height: 100% !important; justify-content: flex-end !important; align-items: center !important; }" +
                        "  .about-text-content { grid-column: 1 / 3 !important; grid-row: 2 !important; text-align: left !important; align-items: flex-start !important; }" +
                        "  .about-buttons { justify-content: flex-start !important; }" +
                        "  .about-vertical-text { font-size: clamp(60px, 12vw, 100px) !important; }" +
                        "  .about-span-white, .about-span-color { font-size: clamp(60px, 12vw, 100px) !important; }" +
                        "}" +
                        /* Small mobile: image left, vertical text right, content below spanning full width */
                        "@media (max-width: 540px) {" +
                        "  .about-grid { grid-template-columns: 1fr clamp(40px, 10vw, 60px) !important; gap: 24px 0px !important; }" +
                        "  .about-image { max-width: clamp(180px, 65vw, 280px) !important; min-height: clamp(180px, 65vw, 280px) !important; margin: 0 auto !important; }" +
                        "  .about-vertical-wrapper { justify-content: center !important; padding-right: 5px !important; }" +
                        "  .about-vertical-text { font-size: clamp(48px, 12vw, 68px) !important; line-height: 0.75 !important; }" +
                        "  .about-span-white, .about-span-color { font-size: clamp(48px, 12vw, 68px) !important; }" +
                        "}" +
                        /* 4K: cap grid max-width centrally, scale up spans */
                        "@media (min-width: 2200px) {" +
                        "  .about-span-white, .about-span-color { font-size: clamp(96px, 6vw, 140px) !important; }" +
                        "}",
                }}
            />
        </section>
    )
}

addPropertyControls(AboutMe, {
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#000000",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#FF6B00",
    },
    profileImage: { type: ControlType.Image, title: "Profile Image" },
    greeting: {
        type: ControlType.String,
        title: "Greeting",
        defaultValue: "Hi, I'm Anky.",
    },
    paragraph1: {
        type: ControlType.String,
        title: "Paragraph 1",
        defaultValue: "A second-year student at USDI, GGSIPU.",
    },
    paragraph2: {
        type: ControlType.String,
        title: "Paragraph 2",
        defaultValue:
            "I am a full-time freelance designer focused on creating modern digital experiences.",
    },
    paragraph3: {
        type: ControlType.String,
        title: "Paragraph 3",
        defaultValue:
            "Passionate about branding, UI/UX, and visual storytelling.",
    },
    buttons: {
        type: ControlType.Array,
        title: "Skill Buttons",
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.Image, title: "Button Icon" },
                link: { type: ControlType.String, title: "Link URL" },
                iconPadding: {
                    type: ControlType.Number,
                    title: "Icon Padding",
                    defaultValue: 18,
                    min: 0,
                    max: 30,
                    step: 1,
                    displaySegmentedControl: false,
                },
            },
        },
    },
})
