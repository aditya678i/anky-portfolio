import * as React from "react"
import { addPropertyControls, ControlType, motion } from "framer"

export default function AestheticFooter(props) {
    const {
        headingText,
        mainText = "Anky M",
        mainLink = "#",
        backgroundColor,
        textColor,
        accentColor,
        socialHeading,
        socialIcons,
        sectionHeading,
        sectionLinks,
    } = props

    return (
        <footer
            style={{
                width: "100%",
                backgroundColor: backgroundColor,
                color: textColor,
                padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 60px) clamp(20px, 3vw, 40px)",
                fontFamily: "Inter, -apple-system, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(24px, 4vw, 40px)",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* Top Large CTA Section */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px", // Reduced from 24px
                    maxWidth: "1200px",
                }}
            >
                <h2
                    style={{
                        fontSize: "clamp(36px, 6vw, 80px)", // Slightly reduced max font size
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                    }}
                >
                    {headingText}
                </h2>

                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
                        .aesthetic-footer-mainlink:hover .footer-link-underline {
                            opacity: 1 !important;
                            transform: scaleX(1) !important;
                        }
                        .footer-link-underline {
                            transform: scaleX(0);
                            transform-origin: left center;
                            transition: transform 0.3s ease, opacity 0.3s ease;
                        }
                    `}
                </style>
                <motion.a
                    href={mainLink}
                    className="aesthetic-footer-mainlink"
                    whileHover={{ 
                        x: 10, 
                        scale: 1.05, 
                        color: "#FF6B00",
                        textShadow: "0px 0px 20px rgba(255,107,0,0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                        fontSize: "clamp(32px, 5vw, 64px)", 
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        color: accentColor,
                        textDecoration: "none",
                        fontWeight: 700,
                        width: "fit-content",
                        paddingBottom: "8px",
                        position: "relative",
                        display: "inline-block",
                        transformOrigin: "left center"
                    }}
                >
                    {mainText}
                    {/* Minimal Underline */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "2px",
                            backgroundColor: "#FF6B00",
                            opacity: 0,
                            transition: "opacity 0.3s ease"
                        }}
                        className="footer-link-underline"
                    />
                </motion.a>
            </div>

            {/* Bottom Links & Copyright */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px", // Reduced from 60px
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: "30px", // Reduced from 60px
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "30px", // Reduced from 60px
                    }}
                >
                    {/* Socials - Left Side */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px", // Reduced from 24px
                        }}
                    >
                        <h4
                            style={{
                                margin: 0,
                                fontSize: "20px", // Reduced from 24px
                                color: textColor,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {socialHeading}
                        </h4>
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                flexWrap: "wrap",
                            }}
                        >
                            {socialIcons &&
                                socialIcons.map((item, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={item.link}
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor:
                                                "rgba(255,255,255,0.1)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "44px", // Reduced from 56px
                                            height: "44px", // Reduced from 56px
                                            borderRadius: "50%",
                                            backgroundColor:
                                                "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            textDecoration: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {item.icon ? (
                                            <img
                                                src={item.icon}
                                                alt="social"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.15)",
                                                    borderRadius: "4px",
                                                }}
                                            />
                                        )}
                                    </motion.a>
                                ))}
                        </div>
                    </div>

                    {/* Section Links - Right Side */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px", // Reduced from 20px
                            minWidth: "160px",
                        }}
                    >
                        <h4
                            style={{
                                margin: 0,
                                fontSize: "18px", // Reduced from 20px
                                color: textColor,
                                fontWeight: 500,
                                letterSpacing: "-0.01em",
                                marginBottom: "4px", // Reduced from 8px
                            }}
                        >
                            {sectionHeading}
                        </h4>
                        {sectionLinks &&
                            sectionLinks.map((item, idx) => (
                                <motion.a
                                    key={idx}
                                    href={item.link}
                                    whileHover={{ x: 5, color: accentColor }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        color: "rgba(255,255,255,0.7)",
                                        textDecoration: "none",
                                        fontSize: "15px", // Reduced from 17px
                                        fontWeight: 400,
                                        cursor: "pointer",
                                    }}
                                >
                                    {item.text}
                                </motion.a>
                            ))}
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        fontSize: "13px", // Reduced from 14px
                        color: "rgba(255,255,255,0.3)",
                        fontWeight: 400,
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        paddingTop: "20px", // Reduced from 24px
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <span>
                        © {new Date().getFullYear()} All rights reserved.
                    </span>
                    <span>Designed with ❤️</span>
                </div>
            </div>
        </footer>
    )
}

// ----------------------------------------------------------------------
// Framer Property Controls
// ----------------------------------------------------------------------
addPropertyControls(AestheticFooter, {
    headingText: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Let's build something great.",
    },
    mainText: {
        type: ControlType.String,
        title: "Main Text",
        defaultValue: "Anky M",
    },
    mainLink: {
        type: ControlType.String,
        title: "Main Link",
        defaultValue: "#",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#050505",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#a3a3a3",
    },
    socialHeading: {
        type: ControlType.String,
        title: "Social Heading",
        defaultValue: "Let's connect!",
    },
    socialIcons: {
        type: ControlType.Array,
        title: "Social Icons",
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.Image, title: "Icon Image" },
                link: { type: ControlType.Link, title: "Link URL" },
            },
        },
        defaultValue: [{ link: "" }, { link: "" }, { link: "" }],
    },
    sectionHeading: {
        type: ControlType.String,
        title: "Section Heading",
        defaultValue: "Section",
    },
    sectionLinks: {
        type: ControlType.Array,
        title: "Section Links",
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Link Text" },
                link: { type: ControlType.Link, title: "Link URL" },
            },
        },
        defaultValue: [
            { text: "Work", link: "" },
            { text: "Services", link: "" },
            { text: "Testimonial", link: "" },
            { text: "Pricing", link: "" },
            { text: "FAQ", link: "" },
        ],
    },
})
