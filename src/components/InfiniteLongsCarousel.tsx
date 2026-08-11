import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// ── YouTube helpers ──────────────────────────────────────────────────────────
function getVideoId(url: string): string | null {
    if (!url) return null
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})/
    )
    return match?.[1] ?? null
}

function getThumbnail(url: string): string {
    const id = getVideoId(url)
    // maxresdefault for high quality, fallback to hqdefault
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ""
}

function getEmbedUrl(url: string, muted: boolean): string {
    const id = getVideoId(url)
    if (!id) return ""
    const muteParam = muted ? 1 : 0
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${muteParam}&loop=1&controls=1&rel=0&modestbranding=1&playsinline=1&playlist=${id}&enablejsapi=1`
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function InfiniteLongsCarousel(props) {
    const { videos, cardWidth, cardHeight, arrowColor } = props

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    // activeIndex = which card user has clicked Play on (-1 = none playing)
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const activeMuteStateRef = useRef(false)

    let baseVideos = videos && videos.length > 0 ? videos : []
    let currentVideos = [...baseVideos]
    if (currentVideos.length > 0 && currentVideos.length < 7) {
        while (currentVideos.length < 7) {
            currentVideos = [...currentVideos, ...baseVideos]
        }
    }
    const length = currentVideos.length

    const next = () => {
        if (length > 0) {
            setCurrentIndex((prev) => (prev + 1) % length)
            setActiveIndex(-1) // reset video on navigation
        }
    }
    const prev = () => {
        if (length > 0) {
            setCurrentIndex((prev) => (prev - 1 + length) % length)
            setActiveIndex(-1) // reset video on navigation
        }
    }

    // Mute/Unmute active iframe via postMessage
    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe?.contentWindow) return
        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: isMuted ? "mute" : "unMute",
                args: [],
            }),
            "*"
        )
    }, [isMuted])

    if (length === 0) {
        return (
            <div
                style={{
                    ...containerStyle,
                    color: "white",
                    textAlign: "center",
                }}
            >
                <h2>Please paste your YouTube Links!</h2>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            {/* ── MUTE BUTTON — only when a video is playing ── */}
            <AnimatePresence>
                {activeIndex !== -1 && (
                    <motion.button
                        key="mute"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ ...muteButtonStyle, color: arrowColor }}
                        onClick={() => setIsMuted(!isMuted)}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(255,255,255,0.15)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        title={isMuted ? "Unmute Sound" : "Mute Sound"}
                    >
                        {isMuted ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── 3D CAROUSEL TRACK ── */}
            <div style={carouselStyle}>
                {currentVideos.map((videoUrl, index) => {
                    let offset = (index - currentIndex) % length
                    if (offset > Math.floor(length / 2)) offset -= length
                    if (offset < -Math.ceil(length / 2)) offset += length

                    const isCenter = offset === 0
                    const absOffset = Math.abs(offset)
                    const isVisible = absOffset <= 2
                    const isPlaying = isCenter && activeIndex === index

                    let scale = 1,
                        x = 0,
                        opacity = 1,
                        zIndex = 10,
                        rotateY = 0
                    if (absOffset === 1) {
                        scale = 0.8
                        x = offset * (cardWidth * 1.1)
                        opacity = 0.8
                        zIndex = 8
                        rotateY = offset * -20
                    } else if (absOffset === 2) {
                        scale = 0.6
                        x = offset * (cardWidth * 1.6)
                        opacity = 0.5
                        zIndex = 6
                        rotateY = offset * -35
                    } else if (absOffset > 2) {
                        scale = 0.4
                        x = Math.sign(offset) * (cardWidth * 1.9)
                        opacity = 0
                        zIndex = 0
                        rotateY = Math.sign(offset) * -45
                    }

                    const thumb = getThumbnail(videoUrl)
                    const embedUrl = getEmbedUrl(videoUrl, activeMuteStateRef.current)

                    return (
                        <motion.div
                            key={index}
                            initial={false}
                            animate={{
                                scale,
                                x,
                                opacity: isVisible ? opacity : 0,
                                zIndex,
                                rotateY,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 22,
                                mass: 1,
                            }}
                            style={{
                                ...cardStyle,
                                width: cardWidth,
                                height: cardHeight,
                                pointerEvents: isVisible ? "auto" : "none",
                            }}
                            onClick={() => {
                                // Side card click → navigate only
                                if (!isCenter && isVisible) {
                                    setCurrentIndex(index)
                                    setActiveIndex(-1)
                                }
                            }}
                        >
                            {/* ── THUMBNAIL (default state) ── */}
                            <AnimatePresence>
                                {!isPlaying && (
                                    <motion.div
                                        key="thumb"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={thumbWrapStyle}
                                    >
                                        {/* Thumbnail image */}
                                        <img
                                            src={thumb}
                                            alt="video thumbnail"
                                            style={thumbImgStyle}
                                        />

                                        {/* Dark blur overlay for side cards */}
                                        {!isCenter && (
                                            <div style={sideOverlayStyle} />
                                        )}

                                        {/* PLAY BUTTON — center card only */}
                                        {isCenter && (
                                            <motion.button
                                                style={playBtnStyle}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    activeMuteStateRef.current = isMuted
                                                    setActiveIndex(index)
                                                }}
                                                whileHover={{ scale: 1.12 }}
                                                whileTap={{ scale: 0.92 }}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.7,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20,
                                                }}
                                            >
                                                <svg
                                                    width="36"
                                                    height="36"
                                                    viewBox="0 0 24 24"
                                                    fill="white"
                                                >
                                                    <polygon points="5,3 19,12 5,21" />
                                                </svg>
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── IFRAME (loads only after Play click) ── */}
                            {isPlaying && (
                                <motion.div
                                    key="iframe"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        inset: 0,
                                    }}
                                >
                                    <iframe
                                        ref={iframeRef}
                                        src={embedUrl}
                                        style={iframeElementStyle}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* ── NAVIGATION ARROWS ── */}
            <motion.button
                whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.75 }}
                onClick={prev}
                style={{ ...arrowStyle, left: "10px" }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={arrowColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </motion.button>

            <motion.button
                whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.75 }}
                onClick={next}
                style={{ ...arrowStyle, right: "10px" }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={arrowColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </motion.button>
        </div>
    )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    perspective: "1200px",
    overflow: "hidden",
    padding: "clamp(20px, 4vw, 40px) 0",
    background: "transparent",
}
const carouselStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: "450px",
    transformStyle: "preserve-3d",
}
const cardStyle: React.CSSProperties = {
    position: "absolute",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
        "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
    backgroundColor: "#111",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}
const thumbWrapStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}
const thumbImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    pointerEvents: "none",
    userSelect: "none",
}
const sideOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
}
const playBtnStyle: React.CSSProperties = {
    position: "absolute",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "2px solid rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
}
const iframeElementStyle: React.CSSProperties = {
    width: "102%",
    height: "102%",
    objectFit: "cover",
    border: "none",
    transform: "scale(1.05)",
}
const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(50% - 32px)",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    outline: "none",
    padding: 0,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
    zIndex: 50,
}
const muteButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    outline: "none",
    padding: 0,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
    zIndex: 60,
}

addPropertyControls(InfiniteLongsCarousel, {
    videos: {
        type: ControlType.Array,
        control: {
            type: ControlType.String,
            placeholder: "Paste YouTube link here",
        },
        defaultValue: [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=jNQXAC9IVRw",
            "https://www.youtube.com/watch?v=9bZkp7q19f0",
            "https://www.youtube.com/watch?v=kXYiU_JCYtU",
        ],
        title: "YouTube Links",
    },
    cardWidth: {
        type: ControlType.Number,
        defaultValue: 560,
        min: 300,
        max: 1200,
        title: "Video Width",
    },
    cardHeight: {
        type: ControlType.Number,
        defaultValue: 315,
        min: 200,
        max: 800,
        title: "Video Height",
    },
    arrowColor: {
        type: ControlType.Color,
        defaultValue: "#FFFFFF",
        title: "Arrow Color",
    },
})
