import * as React from "react"
import { useState } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

export default function ParallaxHero(props) {
    const { 
        name = "Alex", 
        buttonText = "Let's Talk", 
        image, 
        navLinks = ["Work", "Services", "Pricing", "FAQ"],
        avatars, 
        avatarSize = 40, 
        clientText = "50+ Happy Clients" 
    } = props
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isContactHovered, setIsContactHovered] = useState(false)

    const defaultAvatars = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    ]
    const displayAvatars = avatars && avatars.length > 0 && avatars[0] ? avatars : defaultAvatars

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = (e) => {
        const xPct = e.clientX / window.innerWidth - 0.5
        const yPct = e.clientY / window.innerHeight - 0.5
        mouseX.set(xPct)
        mouseY.set(yPct)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    const shiftX = useTransform(mouseX, [-0.5, 0.5], [-80, 80])
    const shiftY = useTransform(mouseY, [-0.5, 0.5], [-80, 80])

    const smoothX = useSpring(shiftX, { stiffness: 40, damping: 15, mass: 1 })
    const smoothY = useSpring(shiftY, { stiffness: 40, damping: 15, mass: 1 })

    return (
        <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                width: "100%",
                height: "100%",
                minHeight: "100vh",
                backgroundColor: "#000000",
                color: "#fff",
                fontFamily: "'Inter', -apple-system, sans-serif",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <style>{`
                .ui-navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 2vw;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                }
                .logo-text {
                    font-family: 'Anton', 'Impact', sans-serif;
                    font-size: 26px;
                    background: linear-gradient(270deg, #ff007a, #7000ff, #00f0ff, #ff007a);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradientBG 4s ease infinite;
                    letter-spacing: 1px;
                }
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .nav-links-desktop {
                    display: flex;
                    gap: 50px;
                    font-size: 11px;
                    gap: 15px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .nav-item {
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                .nav-item:hover { color: #a0a0a0; }

                /* Highlight Desktop Nav Items */
                .nav-links-desktop .nav-item {
                    padding: 8px 16px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                .nav-links-desktop .nav-item:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
                }
                .hamburger {
                    display: none;
                    font-size: 24px;
                    cursor: pointer;
                    pointer-events: auto;
                }
                .mobile-menu {
                    position: absolute;
                    top: 90px;
                    right: 8vw;
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 20px 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    z-index: 60;
                }
                .ui-overlay {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                    position: absolute;
                    top: 65%;
                    bottom: auto;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    pointer-events: none;
                    padding: 0 8vw; 
                    box-sizing: border-box;
                }
                .ui-left {
                    pointer-events: auto;
                }
                .ui-right {
                    pointer-events: auto;
                }
                .bg-text {
                    font-size: clamp(80px, 18vw, 280px);
                    background: linear-gradient(to bottom, #ffffff 0%, #b0b0b0 50%, #666666 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .center-image-container {
                    position: relative;
                    z-index: 5;
                    width: clamp(300px, 45vw, 650px);
                    height: clamp(300px, 45vw, 650px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 5vh;
                }

                @media (max-width: 900px) {
                    .nav-links-desktop {
                        display: none;
                    }
                    .hamburger {
                        display: block;
                    }
                    .ui-overlay {
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        bottom: 60px;
                        gap: 20px;
                    }
                    .ui-left {
                        max-width: 90%;
                        transform-origin: center center;
                        transform: scale(0.85);
                    }
                    .bg-text {
                        font-size: clamp(60px, 20vw, 150px) !important;
                        top: 25% !important;
                    }
                    .center-image-container {
                        margin-top: 0vh !important;
                        width: clamp(350px, 80vw, 650px) !important;
                        height: clamp(350px, 80vw, 650px) !important;
                    }
                }
            `}</style>

            {/* Navbar */}
            <motion.div 
                className="ui-navbar"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
                {/* Animated Logo */}
                <div className="logo-text" style={{ pointerEvents: "auto", cursor: "pointer" }}>
                    @ankyym
                </div>

                {/* Desktop Nav Links */}
                <div className="nav-links-desktop">
                    {navLinks.map((link, idx) => (
                        <motion.div 
                            className="nav-item"
                            key={idx} 
                            style={{ pointerEvents: "auto" }}
                        >
                            {link}
                        </motion.div>
                    ))}
                </div>

                {/* Hamburger Icon */}
                <div 
                    className="hamburger" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </div>
            </motion.div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navLinks.map((link, idx) => (
                            <motion.div 
                                key={idx} 
                                style={{ cursor: "pointer", pointerEvents: "auto" }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Hero Container */}
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                
                {/* Background Text */}
                <motion.div
                    className="bg-text"
                    initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "50%",
                        fontFamily: "'Anton', 'Impact', sans-serif",
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                        zIndex: 1,
                        textTransform: "uppercase",
                        pointerEvents: "none",
                        letterSpacing: "-2px"
                    }}
                >
                    {name}
                </motion.div>

                {/* UI Overlay */}
                <div className="ui-overlay">
                    <motion.div
                        className="ui-left"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "6px 16px 6px 6px",
                                background: "rgba(10, 10, 12, 0.6)",
                                backdropFilter: "blur(24px)",
                                WebkitBackdropFilter: "blur(24px)",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.15)",
                                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5), 0 0 15px rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                                cursor: "default",
                                userSelect: "none",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                {(displayAvatars || []).map((src, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            width: avatarSize,
                                            height: avatarSize,
                                            borderRadius: "50%",
                                            border: "2px solid #1a1a1f",
                                            overflow: "hidden",
                                            backgroundColor: "#0f0f12",
                                            marginLeft: i === 0 ? 0 : -10,
                                            zIndex: (displayAvatars || []).length - i,
                                            position: "relative",
                                            flexShrink: 0,
                                            boxShadow: "-2px 0 8px rgba(0,0,0,0.5)",
                                            cursor: "pointer",
                                        }}
                                        whileHover={{
                                            scale: 1.28,
                                            y: -6,
                                            zIndex: 20,
                                            boxShadow: "0 14px 28px -4px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.15)",
                                        }}
                                        transition={{ type: "spring", stiffness: 420, damping: 26 }}
                                    >
                                        <img src={src} alt="Client" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                                    </motion.div>
                                ))}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", minWidth: 0, marginTop: 1 }}>
                                <span style={{ color: "#e0e0e0", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, whiteSpace: "nowrap", lineHeight: 1, textTransform: "uppercase", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>{clientText}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="ui-right"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <motion.button
                            onHoverStart={() => setIsContactHovered(true)}
                            onHoverEnd={() => setIsContactHovered(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                position: "relative",
                                background: "#000",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 12,
                                padding: "14px 32px",
                                borderRadius: 999,
                                border: "1px solid transparent",
                                backgroundClip: "padding-box",
                                cursor: "pointer",
                                letterSpacing: 0.5,
                            }}
                        >
                            <motion.div 
                                animate={{
                                    filter: isContactHovered ? "blur(10px)" : "blur(0px)",
                                    opacity: isContactHovered ? 0.8 : 1
                                }}
                                style={{
                                    position: "absolute",
                                    top: -2, left: -2, right: -2, bottom: -2,
                                    background: "linear-gradient(90deg, #3200ff, #ff00aa, #ffaa00)",
                                    borderRadius: 999,
                                    zIndex: -1,
                                    transition: "all 0.3s ease"
                                }} 
                            />
                            {buttonText}
                        </motion.button>
                    </motion.div>
                </div>

                {/* Center Parallax Image */}
                <motion.div
                    className="center-image-container"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
                    style={{
                        x: smoothX,
                        y: smoothY,
                        pointerEvents: "none"
                    }}
                >
                    {image ? (
                        <img 
                            src={image} 
                            alt="Hero Face" 
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.8))"
                            }}
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", background: "#222", borderRadius: "50%" }} />
                    )}
                </motion.div>
            </div>
        </div>
    )
}

// 5 Items added in default navLinks
addPropertyControls(ParallaxHero, {
    name: { type: ControlType.String, title: "Background Text", defaultValue: "HI, I'M ANKY" },
    buttonText: { type: ControlType.String, title: "Button Text", defaultValue: "CONTACT ME" },
    image: { type: ControlType.Image, title: "Center Face Image" },
    navLinks: { type: ControlType.Array, title: "Nav Links", control: { type: ControlType.String }, defaultValue: ["ABOUT", "SERVICES", "CUSTOMERS", "PROJECTS", "CONTACT"] },
    avatars: {
        type: ControlType.Array,
        title: "Client Avatars",
        control: { type: ControlType.Image },
        defaultValue: [
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        ],
    },
    avatarSize: {
        type: ControlType.Number,
        title: "Avatar Size",
        defaultValue: 36,
        min: 24,
        max: 60,
        step: 1,
        displayStepper: true,
    },
    clientText: {
        type: ControlType.String,
        title: "Client Text",
        defaultValue: "Worked with 50+ Clients",
    }
})