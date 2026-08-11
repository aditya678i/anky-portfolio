const fs = require('fs');

let t = fs.readFileSync('src/StickyTestimonialsMarquee.tsx', 'utf8');
let f = fs.readFileSync('src/FaqMonochrome.tsx', 'utf8');
let a = fs.readFileSync('src/AnimaFooter.tsx', 'utf8');

const stripImports = (str) => str.replace(/^import\s+.*?from\s+['"].*?['"];?\n/gm, '');
const stripExportDefault = (str) => str.replace(/export default function/g, 'function');
const stripPropertyControls = (str) => {
    const idx = str.indexOf('addPropertyControls(');
    return idx !== -1 ? str.substring(0, idx) : str;
};

t = stripPropertyControls(stripExportDefault(stripImports(t)));
f = stripPropertyControls(stripExportDefault(stripImports(f)));
a = stripPropertyControls(stripExportDefault(stripImports(a)));

const imports = `import React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"`;

const combined = `
export default function CombinedSection(props: any) {
    return (
        <div style={{ width: "100%", backgroundColor: props.pageBackgroundColor || "#000" }}>
            <StickyTestimonialsMarquee 
                heading={props.test_heading}
                testimonials={props.testimonials}
                backgroundColor={props.test_backgroundColor}
                cardBackground={props.test_cardBackground}
                borderColor={props.test_borderColor}
                headingColor={props.test_headingColor}
                textColor={props.test_textColor}
                mutedColor={props.test_mutedColor}
                radius={props.test_radius}
                avatarSize={props.test_avatarSize}
                cardWidth={props.test_cardWidth}
                rowGap={props.test_rowGap}
                marqueeSpeed={props.test_marqueeSpeed}
                pinDuration={props.test_pinDuration}
                headingFontSize={props.test_headingFontSize}
            />
            <FaqMonochrome 
                theme={props.faq_theme}
                heading={props.faq_heading}
                items={props.faq_items}
            />
            <AnimaFooter 
                prefix={props.foot_prefix}
                suffix={props.foot_suffix}
                ringColor={props.foot_ringColor}
                backgroundColor={props.foot_backgroundColor}
                textColor={props.foot_textColor}
                linkedinUrl={props.foot_linkedinUrl}
                instagramUrl={props.foot_instagramUrl}
                xUrl={props.foot_xUrl}
            />
        </div>
    )
}
`;

const pc = `
addPropertyControls(CombinedSection, {
    pageBackgroundColor: { type: ControlType.Color, title: "Page BG", defaultValue: "#000000" },
    
    test_heading: { type: ControlType.String, title: "Test. Heading", defaultValue: "What Clients Are Saying" },
    testimonials: {
        type: ControlType.Array, title: "Testimonials",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, defaultValue: "Ava Martinez" },
                company: { type: ControlType.String, defaultValue: "Northline Studio" },
                quote: { type: ControlType.String, defaultValue: "Great work!", displayTextArea: true },
                avatarUrl: { type: ControlType.String, defaultValue: "https://i.pravatar.cc/180?img=12" },
                avatar: { type: ControlType.ResponsiveImage },
            },
        },
    },
    test_backgroundColor: { type: ControlType.Color, title: "Test. BG", defaultValue: "#0A0A0A" },
    test_cardBackground: { type: ControlType.Color, title: "Card BG", defaultValue: "rgba(255,255,255,0.08)" },
    test_borderColor: { type: ControlType.Color, title: "Card Border", defaultValue: "rgba(255,255,255,0.24)" },
    test_headingColor: { type: ControlType.Color, title: "Test. Heading Col", defaultValue: "#FFFFFF" },
    test_textColor: { type: ControlType.Color, title: "Test. Text", defaultValue: "#F2F2F2" },
    test_mutedColor: { type: ControlType.Color, title: "Test. Muted", defaultValue: "#C8C8C8" },
    test_radius: { type: ControlType.Number, title: "Card Radius", defaultValue: 30 },
    test_avatarSize: { type: ControlType.Number, title: "Avatar Size", defaultValue: 64 },
    test_cardWidth: { type: ControlType.Number, title: "Card Width", defaultValue: 380 },
    test_rowGap: { type: ControlType.Number, title: "Row Gap", defaultValue: 22 },
    test_marqueeSpeed: { type: ControlType.Number, title: "Marquee Speed", defaultValue: 75 },
    test_pinDuration: { type: ControlType.Number, title: "Pin Duration", defaultValue: 500 },
    test_headingFontSize: { type: ControlType.Number, title: "Test. Head Size", defaultValue: 64 },

    faq_theme: { type: ControlType.Enum, options: ["Dark", "Light"], defaultValue: "Dark", title: "FAQ Theme" },
    faq_heading: { type: ControlType.String, defaultValue: "Frequently Asked", title: "FAQ Heading" },
    faq_items: {
        type: ControlType.Array, title: "FAQ Questions",
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, defaultValue: "New Question?" },
                answer: { type: ControlType.String, displayTextArea: true, defaultValue: "Detailed answer." }
            }
        }
    },

    foot_prefix: { type: ControlType.String, title: "Footer Left", defaultValue: "Ed" },
    foot_suffix: { type: ControlType.String, title: "Footer Right", defaultValue: "tor" },
    foot_ringColor: { type: ControlType.Color, title: "Ring Color", defaultValue: "#0055FF" },
    foot_backgroundColor: { type: ControlType.Color, title: "Footer BG", defaultValue: "#FFFFFF" },
    foot_textColor: { type: ControlType.Color, title: "Footer Text Col", defaultValue: "#0A0A0A" },
    foot_linkedinUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "https://linkedin.com" },
    foot_instagramUrl: { type: ControlType.String, title: "Instagram URL", defaultValue: "https://instagram.com" },
    foot_xUrl: { type: ControlType.String, title: "X URL", defaultValue: "https://x.com" }
});
`;

fs.writeFileSync('src/CombinedSection.tsx', imports + '\n\n' + t + '\n\n' + f + '\n\n' + a + '\n\n' + combined + '\n\n' + pc);
console.log('Combined successfully into src/CombinedSection.tsx');
