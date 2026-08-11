import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { CheckCheck } from "lucide-react"

// --- Helper Components ---

const VerticalCutReveal = ({ text, delay = 0 }) => {
    const words = text.split(" ")
    return (
        <span
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                paddingBottom: "8px",
            }}
        >
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    style={{
                        display: "inline-flex",
                        overflow: "hidden",
                        paddingBottom: "8px",
                    }}
                >
                    <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 40,
                            delay: delay + wordIndex * 0.15,
                        }}
                        style={{ display: "inline-block" }}
                    >
                        {word}
                    </motion.span>
                    {wordIndex !== words.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </span>
    )
}

const AnimatedCard = ({ children, index }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{
                delay: (index + 1) * 0.2,
                duration: 0.5,
            }}
            whileHover={{ scale: 1.03 }}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
            {children}
        </motion.div>
    )
}

// --- Main Component ---

export default function PricingSection(props) {
    const title = props.title || PricingSection.defaultProps.title
    const plans = props.plans || PricingSection.defaultProps.plans

    return (
        <div style={styles.container}>
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');" +
                        "@media (max-width: 1024px) { .pricing-grid { display: flex !important; flex-direction: column !important; gap: 16px !important; } }" +
                        "@media (max-width: 480px) { .pricing-grid { padding: 0 !important; } .pricing-card { border-radius: 12px !important; } }" +
                        "@media (min-width: 2200px) { .pricing-grid { max-width: 1800px !important; margin: 0 auto !important; } }",
                }}
            />

            <div style={styles.headerContainer}>
                <h1 style={styles.title}>
                    <VerticalCutReveal text={title} />
                </h1>
            </div>

            <div style={styles.grid} className="pricing-grid">
                {plans.map((plan, index) => {
                    const isPopular = plan.isPopular
                    const cardBg = isPopular ? "#fff7ed" : "#ffffff"
                    const cardBorder = isPopular
                        ? "2px solid #f97316"
                        : "1px solid #e5e5e5"

                    return (
                        <AnimatedCard key={index} index={index}>
                            <div
                                style={{
                                    ...styles.card,
                                    backgroundColor: cardBg,
                                    border: cardBorder,
                                }}
                            >
                                {/* Header */}
                                <div style={styles.cardHeader}>
                                    <div style={styles.cardTitleRow}>
                                        <h3 style={styles.planName}>
                                            {plan.name} Plan
                                        </h3>
                                        {isPopular && (
                                            <span style={styles.popularBadge}>
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p style={styles.description}>
                                        {plan.description}
                                    </p>
                                    <div style={styles.priceRow}>
                                        <span style={styles.priceAmount}>
                                            ${plan.price}
                                        </span>
                                        <span style={styles.priceLabel}>
                                            {plan.priceLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={styles.cardContent}>
                                    <motion.a
                                        href={plan.buttonLink}
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{
                                            backgroundColor: "#f97316", // Orange-500
                                            color: "#ffffff",
                                            borderColor: "#fb923c", // Orange-400
                                            backgroundImage:
                                                "linear-gradient(to top, #f97316, #ea580c)",
                                        }}
                                        style={{
                                            ...styles.button,
                                            ...(isPopular
                                                ? styles.buttonPopular
                                                : styles.buttonNormal),
                                            display: "block",
                                            textAlign: "center",
                                            textDecoration: "none",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {plan.buttonText}
                                    </motion.a>

                                    <div style={styles.featuresSection}>
                                        <h2 style={styles.featuresTitle}>
                                            Features
                                        </h2>
                                        <h4 style={styles.featuresSubtitle}>
                                            {plan.includesHeader}
                                        </h4>
                                        <ul style={styles.featureList}>
                                            {plan.features.map(
                                                (feature, fIndex) => (
                                                    <li
                                                        key={fIndex}
                                                        style={
                                                            styles.featureItem
                                                        }
                                                    >
                                                        <span
                                                            style={
                                                                styles.checkIconWrapper
                                                            }
                                                        >
                                                            <CheckCheck
                                                                size={12}
                                                                color="#f97316"
                                                            />
                                                        </span>
                                                        <span
                                                            style={
                                                                styles.featureText
                                                            }
                                                        >
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>
                    )
                })}
            </div>
        </div>
    )
}

// --- Default Props ---
PricingSection.defaultProps = {
    title: "Our Pricing",
    plans: [
        {
            name: "Basic",
            description:
                "Perfect for creators who need clean, high-quality video edits.",
            price: 99,
            priceLabel: "p/project",
            isPopular: false,
            buttonText: "Get started",
            buttonLink: "https://www.instagram.com/ankyym/", // Default empty link
            includesHeader: "Basic includes:",
            features: [
                "1 - 1080p Video",
                "Music Included",
                "Subtle Editing",
                "24/7 Chat support",
            ],
        },
        {
            name: "Premium",
            description:
                "Best value for content creators who need consistent, high-volume output.",
            price: 1199,
            priceLabel: "p/month",
            isPopular: true,
            buttonText: "Get started",
            buttonLink: "https://www.instagram.com/ankyym/", // Default empty link
            includesHeader: "Premium includes:",
            features: [
                "12 Short videos",
                "4 Long-forms",
                "Pause or cancel anytime",
                "Motion Graphics",
                "4 Thumbnails Included",
                "Unlimited revisions",
            ],
        },
        {
            name: "Standard",
            description:
                "For businesses needing longer-form content with professional-grade finishing.",
            price: 249,
            priceLabel: "p/project",
            isPopular: false,
            buttonText: "Get started",
            buttonLink: "https://www.instagram.com/ankyym/", // Default empty link
            includesHeader: "Standard includes:",
            features: [
                "1 - 1080p Video (15 min +)",
                "Music & SFX",
                "Pause or cancel anytime",
                "Pacing & Cuts",
                "10 Days Turnaround",
                "Unlimited revisions",
            ],
        },
    ],
}

// --- Property Controls ---
addPropertyControls(PricingSection, {
    title: { type: ControlType.String, title: "Heading" },
    plans: {
        type: ControlType.Array,
        title: "Pricing Plans",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Plan Name" },
                description: { type: ControlType.String, title: "Description" },
                price: { type: ControlType.Number, title: "Price ($)" },
                priceLabel: {
                    type: ControlType.String,
                    title: "Label (e.g., p/month)",
                },
                isPopular: {
                    type: ControlType.Boolean,
                    title: "Highlight as Popular",
                },
                buttonText: { type: ControlType.String, title: "Button Text" },
                buttonLink: { type: ControlType.Link, title: "Button Link" }, // Added link control here
                includesHeader: {
                    type: ControlType.String,
                    title: "Features Header",
                },
                features: {
                    type: ControlType.Array,
                    title: "Features List",
                    control: { type: ControlType.String },
                },
            },
        },
    },
})

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(20px, 4vw, 40px) clamp(12px, 3vw, 24px)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        backgroundColor: "#e6e9ee",
    },
    headerContainer: {
        textAlign: "center",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "center",
    },
    title: {
        fontSize: "clamp(60px, 15vw, 120px)",
        fontWeight: 800,
        color: "#111827",
        letterSpacing: "-0.02em",
        margin: 0,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 28vw, 320px), 1fr))",
        gap: "clamp(12px, 2vw, 20px)",
        padding: "8px 0",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "16px",
        padding: "16px",
        boxSizing: "border-box",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
    },
    cardHeader: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginBottom: "12px",
    },
    cardTitleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
    },
    planName: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#111827",
        margin: 0,
    },
    popularBadge: {
        backgroundColor: "#f97316",
        color: "#ffffff",
        padding: "4px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
    },
    description: {
        fontSize: "13px",
        color: "#4b5563",
        margin: "0 0 12px 0",
        lineHeight: 1.4,
        minHeight: "38px",
    },
    priceRow: {
        display: "flex",
        alignItems: "baseline",
    },
    priceAmount: {
        fontSize: "32px",
        fontWeight: 700,
        color: "#111827",
    },
    priceLabel: {
        fontSize: "14px",
        color: "#4b5563",
        marginLeft: "4px",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    button: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        fontWeight: 500,
        borderRadius: "10px",
        cursor: "pointer",
        marginBottom: "16px",
        border: "none",
        transition: "all 0.2s ease",
        outline: "none",
        boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    buttonPopular: {
        backgroundImage: "linear-gradient(to top, #ea580c, #f97316)",
        border: "1px solid #fb923c",
        color: "#ffffff",
        boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.4)",
    },
    buttonNormal: {
        backgroundImage: "linear-gradient(to top, #404040, #171717)",
        border: "1px solid #525252",
        color: "#ffffff",
        boxShadow: "0 10px 15px -3px rgba(23, 23, 23, 0.4)",
    },
    featuresSection: {
        paddingTop: "16px",
        borderTop: "1px solid #e5e5e5",
    },
    featuresTitle: {
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "uppercase",
        color: "#111827",
        margin: "0 0 8px 0",
    },
    featuresSubtitle: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#111827",
        margin: "0 0 8px 0",
    },
    featureList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    featureItem: {
        display: "flex",
        alignItems: "flex-start",
    },
    checkIconWrapper: {
        height: "20px",
        width: "20px",
        flexShrink: 0,
        backgroundColor: "#ffffff",
        border: "1px solid #f97316",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2px",
        marginRight: "12px",
    },
    featureText: {
        fontSize: "14px",
        color: "#4b5563",
        fontWeight: 600,
        lineHeight: 1.5,
    },
}