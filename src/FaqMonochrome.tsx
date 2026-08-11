import * as React from "react"
// Mock framer imports
const addPropertyControls = (component: any, controls: any) => {};
const ControlType = { String: "String", Array: "Array", Object: "Object", Enum: "Enum", Number: "Number", Font: "Font" };

import { motion, AnimatePresence } from "framer-motion"

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

export default function FaqMonochrome(props: FaqMonochromeProps) {
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
                    {items.map((item, i) => {
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

addPropertyControls(FaqMonochrome, {
    theme: {
        type: ControlType.Enum,
        options: ["Dark", "Light"],
        defaultValue: "Dark",
        title: "Theme"
    },
    heading: {
        type: ControlType.String,
        defaultValue: "Frequently Asked",
        title: "Heading"
    },
    items: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, defaultValue: "New Question?" },
                answer: { type: ControlType.String, displayTextArea: true, defaultValue: "Here is the detailed answer to the question." }
            }
        },
        defaultValue: DEFAULT_ITEMS,
        title: "Questions"
    },
    padding: {
        type: ControlType.Number,
        defaultValue: 100,
        min: 0,
        max: 240,
        step: 4,
        title: "Padding Y"
    },
    maxWidth: {
        type: ControlType.Number,
        defaultValue: 880,
        min: 400,
        max: 1400,
        step: 10,
        title: "Max Width"
    },
    questionFont: {
        type: ControlType.Font,
        title: "Question Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "22px", variant: "Medium", letterSpacing: "-0.01em" }
    },
    answerFont: {
        type: ControlType.Font,
        title: "Answer Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: "16px", variant: "Regular", lineHeight: "1.6em" }
    }
})
