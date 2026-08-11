import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

export default function ShortsCarousel(props) {
    const { 
        videos = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ], 
        cardWidth = 320, 
        cardHeight = 560, 
        arrowColor = "#fff", 
        glassTint = "rgba(20, 20, 25, 0.45)" 
    } = props
    const [currentIndex, setCurrentIndex] = useState(0)

    const next = () => setCurrentIndex((prev) => (prev + 1) % videos.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)

    const length = videos.length

    return (
        <div style={containerStyle}>
            {/* 3D Carousel Track */}
            <div style={carouselStyle}>
                {videos.map((videoFile, index) => {
                    // Calculate infinite offset distance from center
                    let offset = (index - currentIndex) % length
                    if (offset > Math.floor(length / 2)) offset -= length
                    if (offset < -Math.ceil(length / 2)) offset += length

                    const isCenter = offset === 0
                    const absOffset = Math.abs(offset)
                    
                    // Display only 3 at a time (offset -1, 0, 1). Hide others.
                    const isVisible = absOffset <= 1

                    return (
                        <motion.div
                            key={index}
                            initial={false}
                            animate={{
                                opacity: isVisible ? (isCenter ? 1 : 0.4) : 0,
                                scale: isCenter ? 1 : 0.8,
                                x: offset * (cardWidth * 0.9), // Space out the cards dynamically
                                zIndex: 10 - absOffset,
                                rotateY: offset * -15, // 3D tilt effect
                            }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 260, 
                                damping: 25,
                                mass: 1 
                            }}
                            style={{
                                ...cardStyle,
                                width: cardWidth,
                                height: cardHeight,
                                pointerEvents: isVisible ? "auto" : "none",
                            }}
                            onClick={() => {
                                // Clicking side videos brings them to the center
                                if (!isCenter && isVisible) setCurrentIndex(index)
                            }}
                        >
                            {/* Video Element */}
                            <video 
                                src={videoFile} 
                                style={videoElementStyle}
                                loop
                                muted // Autoplay requires muted
                                autoPlay={isCenter}
                                playsInline
                            />
                            
                            {/* Dark/Blur Overlay for side videos to make center pop */}
                            <div style={{
                                ...overlayStyle,
                                opacity: isCenter ? 0 : 1,
                            }} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Glassmorphism Navigation Controls */}
            <div style={navContainerStyle}>
                <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={prev} 
                    style={{...arrowStyle, background: glassTint}}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={next} 
                    style={{...arrowStyle, background: glassTint}}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </motion.button>
            </div>
        </div>
    )
}

// Inline Styles to guarantee it looks premium in Framer immediately
const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    perspective: "1200px", // Enables 3D space depth
    overflow: "hidden",
    padding: "40px 0",
}

const carouselStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: "500px",
    transformStyle: "preserve-3d",
}

const cardStyle: React.CSSProperties = {
    position: "absolute",
    borderRadius: "24px", // Premium rounded corners
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.08)",
    backgroundColor: "#0a0a0a",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const videoElementStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
}

const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    transition: "opacity 0.4s ease",
}

const navContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "24px",
    marginTop: "48px",
    zIndex: 20,
}

const arrowStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(16px)", // Glassmorphism blur
    outline: "none",
    padding: 0,
    boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.5)",
}

// Property Controls so you can upload MP4s directly in Framer
addPropertyControls(ShortsCarousel, {
    videos: {
        type: ControlType.Array,
        control: {
            type: ControlType.File,
            allowedFileTypes: ["mp4", "webm", "mov"],
        },
        defaultValue: [
            "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
            "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
        ],
        title: "Upload Shorts",
    },
    cardWidth: {
        type: ControlType.Number,
        defaultValue: 280, // 9:16 Ratio
        min: 200,
        max: 500,
        title: "Video Width",
    },
    cardHeight: {
        type: ControlType.Number,
        defaultValue: 500, // 9:16 Ratio
        min: 300,
        max: 900,
        title: "Video Height",
    },
    arrowColor: {
        type: ControlType.Color,
        defaultValue: "#FFFFFF",
        title: "Arrow Color",
    },
    glassTint: {
        type: ControlType.Color,
        defaultValue: "rgba(255, 255, 255, 0.03)",
        title: "Glass Background",
    }
})