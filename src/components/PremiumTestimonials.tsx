import * as React from "react"
import { addPropertyControls, ControlType, motion } from "framer"

export default function PremiumTestimonials(props) {
    const { title, cards, backgroundColor, textColor, cardBackground, speed } =
        props

    const id = React.useId().replace(/:/g, "")

    const baseSet = [
        ...cards,
        ...cards,
        ...cards,
        ...cards,
        ...cards,
        ...cards,
        ...cards,
        ...cards,
    ]

    const TestimonialCard = ({ card }) => (
        <motion.div
            whileHover={{
                scale: 1.04,
                boxShadow: "0px 20px 60px 0px rgba(255, 255, 255, 0.12)",
                borderColor: "rgba(255, 255, 255, 0.35)",
                y: -6,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
                width: "380px",
                height: "280px",
                flexShrink: 0,
                background: `linear-gradient(145deg, #111111, #0a0a0a)`,
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 30px 24px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginRight: "20px",
                cursor: "default",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative large quote mark */}
            <div
                style={{
                    position: "absolute",
                    top: "14px",
                    right: "20px",
                    fontSize: "80px",
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.04)",
                    fontFamily: "Georgia, serif",
                    fontWeight: 700,
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            >
                "
            </div>

            {/* Review Text */}
            <p
                style={{
                    color: "rgba(230, 230, 230, 0.9)",
                    fontSize: "15px",
                    lineHeight: "1.65",
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontWeight: 400,
                    margin: 0,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {card.review}
            </p>

            {/* Glowing Stars */}
            <div style={{ display: "flex", gap: "6px", marginTop: "16px", marginBottom: "4px" }}>
                {[0, 1, 2, 3, 4].map((index) => {
                    const ratingValue = card.rating !== undefined ? card.rating : 5;
                    const fillPercentage = Math.min(Math.max(ratingValue - index, 0), 1) * 100;
                    // generate unique ID so gradients don't conflict across cards
                    const gradId = `starGrad-${card.name.replace(/\s+/g, '')}-${index}`;
                    return (
                        <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: "18px", height: "18px", filter: "drop-shadow(0 0 6px rgba(250,204,21,0.6))" }}>
                            <defs>
                                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset={`${fillPercentage}%`} stopColor="#FACC15" />
                                    <stop offset={`${fillPercentage}%`} stopColor="rgba(255,255,255,0.15)" />
                                </linearGradient>
                            </defs>
                            <path fill={`url(#${gradId})`} fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    );
                })}
            </div>

            {/* Divider */}
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    background: "rgba(255,255,255,0.07)",
                    margin: "12px 0 14px 0",
                    flexShrink: 0,
                }}
            />

            {/* Author Row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                }}
            >
                <img
                    src={card.avatar}
                    alt={card.name}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid rgba(255,255,255,0.15)",
                        backgroundColor: "#222",
                    }}
                />
                <div>
                    <div
                        style={{
                            color: "#ffffff",
                            fontWeight: 600,
                            fontSize: "14px",
                            fontFamily: "Inter, -apple-system, sans-serif",
                            margin: 0,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {card.name}
                    </div>
                    <div
                        style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "12px",
                            fontFamily: "Inter, -apple-system, sans-serif",
                            margin: "2px 0 0 0",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {card.company}
                    </div>
                </div>
            </div>
        </motion.div>
    )

    return (
        <section
            style={{
                width: "100%",
                maxWidth: "100%",
                height: "100%",
                backgroundColor: backgroundColor,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
                padding: "60px 0",
                boxSizing: "border-box",
            }}
        >
            <style>{`
                @keyframes marqueeLoop-${id} {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track-${id} {
                    display: inline-flex;
                    animation: marqueeLoop-${id} ${speed}s linear infinite;
                    will-change: transform;
                }
                .marquee-track-${id}:hover {
                    animation-play-state: paused;
                }
                /* KEY FIX: Use clip-path overflow on wrapper instead of overflow:hidden
                   so hover scale doesn't get clipped */
                .marquee-wrapper-${id} {
                    width: 100%;
                    max-width: 100%;
                    position: relative;
                    /* Add top/bottom padding so hover scale has space and is not clipped */
                    padding: 20px 0;
                    overflow: hidden;
                }
            `}</style>

            <h2
                style={{
                    color: textColor,
                    fontSize: "clamp(32px, 4vw, 52px)",
                    fontWeight: 700,
                    fontFamily: "Inter, -apple-system, sans-serif",
                    textAlign: "center",
                    lineHeight: "1.1",
                    letterSpacing: "-0.02em",
                    margin: "0 0 50px 0",
                    padding: "0 20px",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                }}
            >
                {title}
            </h2>

            {/* Wrapper with padding so hover scale isn't clipped */}
            <div className={`marquee-wrapper-${id}`}>
                <div className={`marquee-track-${id}`}>
                    {/* Track 1 */}
                    <div
                        style={{
                            display: "flex",
                            flexShrink: 0,
                            alignItems: "center",
                        }}
                    >
                        {baseSet.map((card, i) => (
                            <TestimonialCard key={`t1-${i}`} card={card} />
                        ))}
                    </div>
                    {/* Track 2: Exact duplicate for seamless 360 loop */}
                    <div
                        style={{
                            display: "flex",
                            flexShrink: 0,
                            alignItems: "center",
                        }}
                    >
                        {baseSet.map((card, i) => (
                            <TestimonialCard key={`t2-${i}`} card={card} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(PremiumTestimonials, {
    title: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "What Clients Are Saying",
    },
    speed: {
        type: ControlType.Number,
        title: "Scroll Time (s)",
        defaultValue: 150,
        min: 20,
        max: 300,
        displayStepper: true,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background Color",
        defaultValue: "#000000",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    cardBackground: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#0a0a0a",
    },
    cards: {
        type: ControlType.Array,
        title: "Testimonial Cards",
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Client Name",
                    defaultValue: "Sarah Johnson",
                },
                company: {
                    type: ControlType.String,
                    title: "Company",
                    defaultValue: "Vision Studio",
                },
                review: {
                    type: ControlType.String,
                    title: "Review Text",
                    defaultValue:
                        "The quality exceeded our expectations. Communication was smooth and the final result was outstanding.",
                    displayTextArea: true,
                },
                avatar: { type: ControlType.Image, title: "Client Photo" },
            },
        },
        defaultValue: [
            {
                name: "Sarah Johnson",
                company: "Vision Studio",
                review: "The quality exceeded our expectations. Communication was smooth and the final result was outstanding.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                rating: 5,
            },
            {
                name: "Michael Carter",
                company: "Apex Interactive",
                review: "Professional workflow, fast delivery and incredible attention to detail. Highly recommended.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                rating: 4.5,
            },
            {
                name: "Emma Wilson",
                company: "Pixel Forge",
                review: "The final product looked amazing and helped elevate our brand significantly.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
                rating: 5,
            },
        ],
    },
})
